import uuid

from sqlalchemy.orm import Session

from core.constants import ChatRole, LLMFeature, MAX_CHAT_HISTORY_MESSAGES
from core.exceptions import AppError, NotFoundError
from models.chat import ChatMessage, ChatSession
from repositories.chat_repository import ChatRepository
from repositories.resume_repository import ResumeRepository
from services.llm.openai_provider import OpenAIProvider
from services.usage_tracker import ensure_budget_available, record_usage


def _build_resume_summary(resume) -> str | None:
    if not resume:
        return None
    skills = (resume.parsed_data or {}).get("skills", [])
    return f"Skills: {', '.join(skills) or 'none detected'}"


def _build_chat_prompt(resume_summary: str | None, history: list[ChatMessage], new_message: str) -> str:
    lines = ["You are a helpful, knowledgeable AI career assistant. Give practical, specific career advice."]
    if resume_summary:
        lines.append(f"\nCandidate resume summary: {resume_summary}")
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
    def send_message(db: Session, user_id: uuid.UUID, session_id: uuid.UUID, content: str) -> ChatMessage:
        session = ChatService.get_owned_session(db, user_id, session_id)

        ensure_budget_available(db)

        history = ChatRepository.get_recent_messages(db, session.id, MAX_CHAT_HISTORY_MESSAGES)
        ChatRepository.create_message(db, {"session_id": session.id, "role": ChatRole.USER, "content": content})

        resume = ResumeRepository.get_by_id(db, session.resume_id) if session.resume_id else None
        resume_summary = _build_resume_summary(resume)

        try:
            prompt = _build_chat_prompt(resume_summary, history, content)
            response_text, input_tokens, output_tokens = OpenAIProvider().generate(prompt, json_mode=False)
            record_usage(db, user_id, LLMFeature.CHAT, input_tokens, output_tokens)
        except Exception:
            raise AppError("Failed to get a response, please try again")

        return ChatRepository.create_message(
            db, {"session_id": session.id, "role": ChatRole.ASSISTANT, "content": response_text}
        )
