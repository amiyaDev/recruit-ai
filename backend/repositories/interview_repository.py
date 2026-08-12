import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from core.constants import InterviewSessionStatus
from models.interview import InterviewQuestion, InterviewSession


class InterviewRepository:

    @staticmethod
    def create_session(db: Session, data: dict) -> InterviewSession:
        session = InterviewSession(**data)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_session_by_id(db: Session, session_id: uuid.UUID) -> InterviewSession | None:
        return db.query(InterviewSession).filter(InterviewSession.id == session_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: uuid.UUID, skip: int, limit: int) -> list[InterviewSession]:
        return (
            db.query(InterviewSession)
            .filter(InterviewSession.user_id == user_id)
            .order_by(InterviewSession.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count_by_user(db: Session, user_id: uuid.UUID) -> int:
        return db.query(func.count(InterviewSession.id)).filter(InterviewSession.user_id == user_id).scalar() or 0

    @staticmethod
    def list_recent_completed_for_user(db: Session, user_id: uuid.UUID, limit: int = 2) -> list[InterviewSession]:
        return (
            db.query(InterviewSession)
            .filter(InterviewSession.user_id == user_id, InterviewSession.status == InterviewSessionStatus.COMPLETED)
            .order_by(InterviewSession.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def update_session(db: Session, session: InterviewSession, updates: dict) -> InterviewSession:
        for field, value in updates.items():
            setattr(session, field, value)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def bulk_create_questions(db: Session, questions_data: list[dict]) -> list[InterviewQuestion]:
        questions = [InterviewQuestion(**data) for data in questions_data]
        db.add_all(questions)
        db.commit()
        for q in questions:
            db.refresh(q)
        return questions

    @staticmethod
    def get_questions_by_session(db: Session, session_id: uuid.UUID) -> list[InterviewQuestion]:
        return (
            db.query(InterviewQuestion)
            .filter(InterviewQuestion.session_id == session_id)
            .order_by(InterviewQuestion.created_at)
            .all()
        )

    @staticmethod
    def get_question_by_id(db: Session, question_id: uuid.UUID) -> InterviewQuestion | None:
        return db.query(InterviewQuestion).filter(InterviewQuestion.id == question_id).first()

    @staticmethod
    def update_question(db: Session, question: InterviewQuestion, updates: dict) -> InterviewQuestion:
        for field, value in updates.items():
            setattr(question, field, value)
        db.add(question)
        db.commit()
        db.refresh(question)
        return question

    @staticmethod
    def clear_resume_reference(db: Session, resume_id: uuid.UUID) -> None:
        # Sessions stay meaningful (questions/answers/feedback/scores) even
        # once their source resume is gone — detach rather than delete.
        db.query(InterviewSession).filter(InterviewSession.resume_id == resume_id).update({"resume_id": None})
        db.commit()

    @staticmethod
    def clear_job_reference(db: Session, job_id: uuid.UUID) -> None:
        db.query(InterviewSession).filter(InterviewSession.job_id == job_id).update({"job_id": None})
        db.commit()
