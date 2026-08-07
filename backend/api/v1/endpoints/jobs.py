import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from api.dependencies.auth import get_current_user
from api.dependencies.database import get_db
from models.user import User
from schemas.job_schemas import JobCreate, JobListResponse, JobResponse
from services.job_service import JobService

router = APIRouter()


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return JobService.create(db, current_user.id, data)


@router.get("/", response_model=list[JobListResponse])
async def list_jobs(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return JobService.list_for_user(db, current_user.id, skip, limit)


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return JobService.get_owned(db, current_user.id, job_id)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    JobService.delete(db, current_user.id, job_id)