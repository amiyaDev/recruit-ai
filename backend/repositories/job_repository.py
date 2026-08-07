import uuid

from sqlalchemy.orm import Session

from models.job import Job


class JobRepository:

    @staticmethod
    def create(db: Session, job_data: dict) -> Job:
        job = Job(**job_data)
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def get_by_id(db: Session, job_id: uuid.UUID) -> Job | None:
        return db.query(Job).filter(Job.id == job_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> list[Job]:
        return (
            db.query(Job)
            .filter(Job.created_by == user_id)
            .order_by(Job.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def update(db: Session, job: Job, updates: dict) -> Job:
        for field, value in updates.items():
            setattr(job, field, value)
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def delete(db: Session, job: Job) -> None:
        db.delete(job)
        db.commit()