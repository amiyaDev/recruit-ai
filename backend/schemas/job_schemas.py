import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from core.constants import JobStatus


class JobCreate(BaseModel):
    title: str
    company: str | None = None
    description: str 


class JobResponse(BaseModel):
    id: uuid.UUID
    title: str
    company: str | None
    description: str
    extracted_keywords: list[str] | None
    status: JobStatus
    created_at: datetime

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    id: uuid.UUID
    title: str
    company: str | None
    status: JobStatus
    created_at: datetime

    class Config:
        from_attributes = True