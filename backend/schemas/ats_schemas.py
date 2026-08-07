import uuid
from datetime import datetime

from pydantic import BaseModel


class ATSAnalyzeRequest(BaseModel):
    resume_id: uuid.UUID
    job_id: uuid.UUID


class ATSScoreResponse(BaseModel):
    id: uuid.UUID
    resume_id: uuid.UUID
    job_id: uuid.UUID
    score: float
    missing_keywords: list[str] | None
    suggestions: list[str] | None
    created_at: datetime

    class Config:
        from_attributes = True