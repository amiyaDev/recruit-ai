import uuid

from sqlalchemy.orm import Session

from core.constants import JobStatus
from core.exceptions import NotFoundError
from models.job import Job
from repositories.ats_repository import ATSRepository
from repositories.job_repository import JobRepository
from schemas.job_schemas import JobCreate
from services.embedding_service import delete_vector, upsert_vector
from services.keyward_service import extract_skills
from core.constants import JOBS_COLLECTION


class JobService:

    @staticmethod
    def create(db: Session, user_id: uuid.UUID, data: JobCreate) -> Job:
        job = JobRepository.create(
            db,
            {
                "created_by": user_id,
                "title": data.title,
                "company": data.company,
                "description": data.description,
                "status": JobStatus.PENDING,
            },
        )
        return JobService._process(db, job)

    @staticmethod
    def _process(db: Session, job: Job) -> Job:
        try:
            JobRepository.update(db, job, {"status": JobStatus.PROCESSING})

            keywords = extract_skills(job.description)
            upsert_vector(
                JOBS_COLLECTION,
                job.id,
                job.description,
                payload={"job_id": str(job.id), "title": job.title},
            )

            return JobRepository.update(
                db, job, {"extracted_keywords": keywords, "status": JobStatus.READY}
            )
        except Exception:
            return JobRepository.update(db, job, {"status": JobStatus.FAILED})

    @staticmethod
    def list_for_user(db: Session, user_id: uuid.UUID, skip: int, limit: int) -> list[Job]:
        return JobRepository.list_by_user(db, user_id, skip, limit)

    @staticmethod
    def get_owned(db: Session, user_id: uuid.UUID, job_id: uuid.UUID) -> Job:
        job = JobRepository.get_by_id(db, job_id)
        if not job or job.created_by != user_id:
            raise NotFoundError("Job not found")
        return job

    @staticmethod
    def delete(db: Session, user_id: uuid.UUID, job_id: uuid.UUID) -> None:
        job = JobService.get_owned(db, user_id, job_id)
        ATSRepository.delete_by_job(db, job.id)
        delete_vector(JOBS_COLLECTION, job.id)
        JobRepository.delete(db, job)