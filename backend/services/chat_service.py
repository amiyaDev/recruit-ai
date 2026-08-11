import uuid

from sqlalchemy.orm import Session

from core.constants import ChatRole, LLMFeature, MAX_CHAT_HISTORY_MESSAGES
from core.exceptions import AppError, NotFoundError
from models.chat import ChatMessage, ChatSession
from repositories.ats_repository import ATSRepository
from repositories.chat_repository import ChatRepository
from repositories.interview_repository import InterviewRepository
from repositories.resume_repository import ResumeRepository
from services.llm.openai_provider import OpenAIProvider
from services.usage_tracker import ensure_budget_available, record_usage
import json
from database.session import SessionLocal

SYSTEM_PROMPT = (
    "You are the AI career coach embedded in RecruitAI. Below is the candidate's actual "
    "resume, ATS analysis history, and mock interview results (when available) — always "
    "ground your answers in these specifics instead of giving generic, one-size-fits-all "
    "advice. If a section says no data is available, say so plainly and suggest the "
    "candidate use that feature first, rather than inventing details.\n"
    "- If asked about resume mistakes: point to the exact missing keywords or weak areas "
    "found in their ATS history.\n"
    "- If asked what to study: name specific concepts drawn from their weakest interview "
    "answers or missing skills, not generic topics.\n"
    "- If asked about career paths: give informed suggestions based on their actual skill "
    "set, but be explicit that this is AI-informed guidance from training knowledge, not "
    "live job-market data.\n"
    "- If asked for a study roadmap: produce a short, ordered, concrete list of steps."
)


def _build_context_block(resume, ats_scores: list, weak_questions: list) -> str:
    parts = []

    if resume:
        skills = (resume.parsed_data or {}).get("skills", [])
        excerpt = (resume.raw_text or "").strip()[:400]
        parts.append(
            f"Candidate's most recent resume — skills: {', '.join(skills) or 'none detected'}\n"
            f"Excerpt: {excerpt or 'not available'}"
        )
    else:
        parts.append("Candidate has not uploaded/parsed a resume yet.")

    if ats_scores:
        lines = ["Recent ATS analysis results (resume vs. a job description):"]
        for score in ats_scores:
            missing = ", ".join((score.missing_keywords or [])[:8]) or "none"
            suggestions = "; ".join((score.suggestions or [])[:3]) or "none"
            lines.append(f"- Score {score.score:.0f}/100. Missing keywords: {missing}. Suggestions: {suggestions}")
        parts.append("\n".join(lines))
    else:
        parts.append("No ATS analysis run yet.")

    if weak_questions:
        lines = ["Weakest recent mock-interview answers:"]
        for q in weak_questions:
            feedback = (q.ai_feedback or "").strip()[:200]
            score_text = f"{q.score:.0f}/100" if q.score is not None else "unscored"
            lines.append(f"- \"{q.question_text}\" scored {score_text}: {feedback or 'no feedback recorded'}")
        parts.append("\n".join(lines))
    else:
        parts.append("No completed mock interviews yet.")

    return "\n\n".join(parts)


def _get_weak_interview_questions(db: Session, user_id: uuid.UUID, limit: int = 3) -> list:
    sessions = InterviewRepository.list_recent_completed_for_user(db, user_id, limit=2)
    questions = [
        q
        for session in sessions
        for q in InterviewRepository.get_questions_by_session(db, session.id)
        if q.score is not None
    ]
    questions.sort(key=lambda q: q.score)
    return questions[:limit]


def _build_user_context(db: Session, user_id: uuid.UUID) -> str:
    resume = ResumeRepository.get_most_recent_parsed_for_user(db, user_id)
    ats_scores = ATSRepository.list_recent_for_user(db, user_id, limit=2)
    weak_questions = _get_weak_interview_questions(db, user_id, limit=3)
    return _build_context_block(resume, ats_scores, weak_questions)


def _build_chat_prompt(context_block: str, history: list[ChatMessage], new_message: str) -> str:
    lines = [SYSTEM_PROMPT, f"\n{context_block}"]
    if history:
        lines.append("\nConversation so far:")
        for msg in history:
            speaker = "Candidate" if msg.role == ChatRole.USER else "Assistant"
            lines.append(f"{speaker}: {msg.content}")
    lines.append(f"\nCandidate: {new_message}\nAssistant:")
    return "\n".join(lines)


class ChatService:

    @staticmethod
    def create_session(db: Session, user_id: uuid.UUID, resume_id: uuid.UUID | None) -> ChatSession:
        if resume_id:
            resume = ResumeRepository.get_by_id(db, resume_id)
            if not resume or resume.user_id != user_id:
                raise NotFoundError("Resume not found")

        return ChatRepository.create_session(db, {"user_id": user_id, "resume_id": resume_id})

    @staticmethod
    def get_owned_session(db: Session, user_id: uuid.UUID, session_id: uuid.UUID) -> ChatSession:
        session = ChatRepository.get_session_by_id(db, session_id)
        if not session or session.user_id != user_id:
            raise NotFoundError("Chat session not found")
        return session

    @staticmethod
    def get_messages(db: Session, user_id: uuid.UUID, session_id: uuid.UUID) -> list[ChatMessage]:
        ChatService.get_owned_session(db, user_id, session_id)
        return ChatRepository.get_all_messages(db, session_id)

    @staticmethod
    def list_sessions(db: Session, user_id: uuid.UUID, skip: int, limit: int) -> list[ChatSession]:
        return ChatRepository.list_sessions_for_user(db, user_id, skip, limit)

    @staticmethod
    def delete_session(db: Session, user_id: uuid.UUID, session_id: uuid.UUID) -> None:
        session = ChatService.get_owned_session(db, user_id, session_id)
        ChatRepository.delete_messages_by_session(db, session.id)
        ChatRepository.delete_session(db, session)

    @staticmethod
    def send_message(db: Session, user_id: uuid.UUID, session_id: uuid.UUID, content: str) -> ChatMessage:
        session = ChatService.get_owned_session(db, user_id, session_id)

        ensure_budget_available(db)

        history = ChatRepository.get_recent_messages(db, session.id, MAX_CHAT_HISTORY_MESSAGES)
        ChatRepository.create_message(db, {"session_id": session.id, "role": ChatRole.USER, "content": content})
        ChatRepository.set_title_if_missing(db, session, content)

        context_block = _build_user_context(db, user_id)

        try:
            prompt = _build_chat_prompt(context_block, history, content)
            response_text, input_tokens, output_tokens = OpenAIProvider().generate(prompt, json_mode=False)
            record_usage(db, user_id, LLMFeature.CHAT, input_tokens, output_tokens)
        except Exception:
            raise AppError("Failed to get a response, please try again")

        return ChatRepository.create_message(
            db, {"session_id": session.id, "role": ChatRole.ASSISTANT, "content": response_text}
        )
        
    @staticmethod
    def send_message_stream(db: Session, user_id: uuid.UUID, session_id: uuid.UUID, content: str):
        session = ChatService.get_owned_session(db, user_id, session_id)
        ensure_budget_available(db)

        history = ChatRepository.get_recent_messages(db, session.id, MAX_CHAT_HISTORY_MESSAGES)
        ChatRepository.create_message(db, {"session_id": session.id, "role": ChatRole.USER, "content": content})
        ChatRepository.set_title_if_missing(db, session, content)

        context_block = _build_user_context(db, user_id)
        prompt = _build_chat_prompt(context_block, history, content)

        def event_stream():
            full_text = []
            input_tokens = output_tokens = 0
            try:
                for delta, in_tok, out_tok in OpenAIProvider().generate_stream(prompt):
                    if delta:
                        full_text.append(delta)
                        yield f"data: {json.dumps({'delta': delta})}\n\n"
                    if in_tok is not None:
                        input_tokens, output_tokens = in_tok, out_tok
            except Exception:
                yield f"data: {json.dumps({'error': 'Failed to get a response, please try again'})}\n\n"
                return

            stream_db = SessionLocal()
            try:
                ChatRepository.create_message(
                    stream_db, {"session_id": session.id, "role": ChatRole.ASSISTANT, "content": "".join(full_text)}
                )
                record_usage(stream_db, user_id, LLMFeature.CHAT, input_tokens, output_tokens)
            finally:
                stream_db.close()

            yield "data: [DONE]\n\n"

        return event_stream()
