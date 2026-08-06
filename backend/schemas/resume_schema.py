import uuid
from datetime import datetime

from pydantic import BaseModel

from core.constants import ResumeFileType, ResumeStatus


class ResumeResponse(BaseModel):
    id: uuid.UUID
    filename: str
    file_type: ResumeFileType
    status: ResumeStatus
    parsed_data: dict | None
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeListResponse(BaseModel):
    id: uuid.UUID
    filename: str
    status: ResumeStatus
    created_at: datetime

    class Config:
        from_attributes = True