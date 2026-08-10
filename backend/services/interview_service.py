import json
import uuid

from sqlalchemy.orm import Session

from core.constants import InterviewSessionStatus, LLMFeature, MAX_INTERVIEW_QUESTIONS
from core.exceptions import AppError, NotFoundError, ValidationError
from models.interview import InterviewSession
from repositories.interview_repository import InterviewRepository
from repositories.job_repository import JobRepository
from repositories.resume_repository import ResumeRepository
from schemas.interview_schemas import InterviewGenerateRequest
from services.llm.openai_provider import OpenAIProvider
from services.usage_tracker import ensure_budget_available, record_usage


def _build_generate_prompt(skills: list[str], job_title: str | None, job_description: str | None, difficulty: str) -> str:
    context_lines = [f"Candidate skills: {', '.join(skills) or 'not specified'}"]
    if job_title:
        context_lines.append(f"Target job: {job_title}")
    if job_description:
        context_lines.append(f"Job description excerpt: {job_description[:600]}")

    context = "\n".join(context_lines)
    return f"""You are an interview coach generating a mock interview.

{context}
Difficulty: {difficulty}

Generate exactly {MAX_INTERVIEW_QUESTIONS} interview questions, a mix of technical and behavioral, relevant to the candidate's background and target role.

Respond ONLY as JSON in this exact shape:
{{"questions": [{{"question_text": "...", "question_type": "technical"}}, ...]}}
question_type must be either "technical" or "behavioral".
"""


def _build_evaluate_prompt(qa_pairs: list[dict]) -> str:
    blocks = []
    for i, qa in enumerate(qa_pairs, start=1):
        blocks.append(
            f"Q{i} ({qa['question_type']}): {qa['question_text']}\n"
            f"Answer: {qa['answer'] or '(no answer provided)'}"
        )
    joined = "\n\n".join(blocks)

    return f"""You are an interview coach evaluating a candidate's mock interview answers.

{joined}

For each question, give a score from 0 to 10 and short, specific feedback.

Respond ONLY as JSON in this exact shape:
{{"evaluations": [{{"question_index": 1, "score": 7, "feedback": "..."}}, ...]}}
question_index must match the Q numbers above (1-based).
"""


class InterviewService:

    @staticmethod
    def generate(db: Session, user_id: uuid.UUID, data: InterviewGenerateRequest) -> InterviewSession:
        skills: list[str] = []
        job_title = None
        job_description = None

        if data.resume_id:
            resume = ResumeRepository.get_by_id(db, data.resume_id)
            if not resume or resume.user_id != user_id:
                raise NotFoundError("Resume not found")
            skills = (resume.parsed_data or {}).get("skills", [])

        if data.job_id:
            job = JobRepository.get_by_id(db, data.job_id)
            if not job or job.created_by != user_id:
                raise NotFoundError("Job not found")
            job_title = job.title
            job_description = job.description

        ensure_budget_available(db)

        try:
            prompt = _build_generate_prompt(skills, job_title, job_description, data.difficulty.value)
            response_text, input_tokens, output_tokens = OpenAIProvider().generate(prompt)
            record_usage(db, user_id, LLMFeature.INTERVIEW_GENERATE, input_tokens, output_tokens)
            questions_data = json.loads(response_text).get("questions", [])[:MAX_INTERVIEW_QUESTIONS]
        except Exception:
            raise AppError("Failed to generate interview questions, please try again")

        if not questions_data:
            raise AppError("Failed to generate interview questions, please try again")

        session = InterviewRepository.create_session(
            db,
            {
                "user_id": user_id,
                "resume_id": data.resume_id,
                "job_id": data.job_id,
                "difficulty": data.difficulty,
                "status": InterviewSessionStatus.IN_PROGRESS,
            },
        )

        InterviewRepository.bulk_create_questions(
            db,
            [
                {
                    "session_id": session.id,
                    "question_text": q["question_text"],
                    "question_type": q["question_type"],
                }
                for q in questions_data
            ],
        )

        return session

    @staticmethod
    def list_for_user(db: Session, user_id: uuid.UUID, skip: int, limit: int) -> list[InterviewSession]:
        return InterviewRepository.list_by_user(db, user_id, skip, limit)

    @staticmethod
    def get_owned_session(db: Session, user_id: uuid.UUID, session_id: uuid.UUID) -> InterviewSession:
        session = InterviewRepository.get_session_by_id(db, session_id)
        if not session or session.user_id != user_id:
            raise NotFoundError("Interview session not found")
        return session

    @staticmethod
    def answer(db: Session, user_id: uuid.UUID, session_id: uuid.UUID, question_id: uuid.UUID, answer_text: str) -> None:
        session = InterviewService.get_owned_session(db, user_id, session_id)
        if session.status != InterviewSessionStatus.IN_PROGRESS:
            raise ValidationError("This interview session is already completed")

        question = InterviewRepository.get_question_by_id(db, question_id)
        if not question or question.session_id != session.id:
            raise NotFoundError("Question not found")

        InterviewRepository.update_question(db, question, {"user_answer": answer_text})

    @staticmethod
    def evaluate(db: Session, user_id: uuid.UUID, session_id: uuid.UUID) -> InterviewSession:
        session = InterviewService.get_owned_session(db, user_id, session_id)
        if session.status != InterviewSessionStatus.IN_PROGRESS:
            raise ValidationError("This interview session is already completed")

        questions = InterviewRepository.get_questions_by_session(db, session.id)
        if not questions:
            raise NotFoundError("No questions found for this session")

        ensure_budget_available(db)

        qa_pairs = [
            {
                "question_type": q.question_type.value,
                "question_text": q.question_text,
                "answer": q.user_answer,
            }
            for q in questions
        ]

        try:
            prompt = _build_evaluate_prompt(qa_pairs)
            response_text, input_tokens, output_tokens = OpenAIProvider().generate(prompt)
            record_usage(db, user_id, LLMFeature.INTERVIEW_EVALUATE, input_tokens, output_tokens)
            evaluations = json.loads(response_text).get("evaluations", [])
        except Exception:
            raise AppError("Failed to evaluate interview, please try again")

        scores = []
        for evaluation in evaluations:
            index = evaluation.get("question_index")
            if not index or index < 1 or index > len(questions):
                continue
            question = questions[index - 1]
            score = evaluation.get("score")
            InterviewRepository.update_question(
                db, question, {"ai_feedback": evaluation.get("feedback"), "score": score}
            )
            if score is not None:
                scores.append(score)

        overall_score = round(sum(scores) / len(scores), 2) if scores else None

        return InterviewRepository.update_session(
            db, session, {"status": InterviewSessionStatus.COMPLETED, "overall_score": overall_score}
        )
