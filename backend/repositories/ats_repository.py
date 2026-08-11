import uuid

from sqlalchemy.orm import Session

from models.ats_score import ATSScore
from models.resumes import Resume


class ATSRepository:

    @staticmethod
    def create(db: Session, data: dict) -> ATSScore:
        score = ATSScore(**data)
        db.add(score)
        db.commit()
        db.refresh(score)
        return score

    @staticmethod
    def get_by_id(db: Session, ats_id: uuid.UUID) -> ATSScore | None:
        return db.query(ATSScore).filter(ATSScore.id == ats_id).first()

    @staticmethod
    def list_by_resume(db: Session, resume_id: uuid.UUID) -> list[ATSScore]:
        return (
            db.query(ATSScore)
            .filter(ATSScore.resume_id == resume_id)
            .order_by(ATSScore.created_at.desc())
            .all()
        )

    @staticmethod
    def list_recent_for_user(db: Session, user_id: uuid.UUID, limit: int = 2) -> list[ATSScore]:
        return (
            db.query(ATSScore)
            .join(Resume, ATSScore.resume_id == Resume.id)
            .filter(Resume.user_id == user_id)
            .order_by(ATSScore.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def delete_by_resume(db: Session, resume_id: uuid.UUID) -> None:
        db.query(ATSScore).filter(ATSScore.resume_id == resume_id).delete()
        db.commit()

    @staticmethod
    def delete_by_job(db: Session, job_id: uuid.UUID) -> None:
        db.query(ATSScore).filter(ATSScore.job_id == job_id).delete()
        db.commit()