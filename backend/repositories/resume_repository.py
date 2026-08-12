import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from core.constants import ResumeStatus
from models.resumes import Resume


class ResumeRepository:

    @staticmethod
    def create(db: Session, resume_data: dict) -> Resume:
        resume = Resume(**resume_data)
        db.add(resume)
        db.commit()
        db.refresh(resume)
        return resume

    @staticmethod
    def get_by_id(db: Session, resume_id: uuid.UUID) -> Resume | None:
        return db.query(Resume).filter(Resume.id == resume_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> list[Resume]:
        return (
            db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count_by_user(db: Session, user_id: uuid.UUID) -> int:
        return db.query(func.count(Resume.id)).filter(Resume.user_id == user_id).scalar() or 0

    @staticmethod
    def get_most_recent_parsed_for_user(db: Session, user_id: uuid.UUID) -> Resume | None:
        return (
            db.query(Resume)
            .filter(Resume.user_id == user_id, Resume.status == ResumeStatus.PARSED)
            .order_by(Resume.created_at.desc())
            .first()
        )

    @staticmethod
    def update(db: Session, resume: Resume, updates: dict) -> Resume:
        for field, value in updates.items():
            setattr(resume, field, value)
        db.add(resume)
        db.commit()
        db.refresh(resume)
        return resume

    @staticmethod
    def delete(db: Session, resume: Resume) -> None:
        db.delete(resume)
        db.commit()