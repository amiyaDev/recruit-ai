import uuid
from datetime import datetime

from pydantic import BaseModel

from core.constants import ResumeStatus


class RecentResumeItem(BaseModel):
    id: uuid.UUID
    filename: str
    status: ResumeStatus
    created_at: datetime

    class Config:
        from_attributes = True


class RecentAtsScoreItem(BaseModel):
    id: uuid.UUID
    score: float
    job_title: str
    job_company: str | None
    created_at: datetime


class UsageSummary(BaseModel):
    spent_usd: float
    budget_usd: float
    percent: float


class DashboardSummaryResponse(BaseModel):
    resume_count: int
    job_count: int
    interview_count: int
    chat_count: int
    avg_ats_score: float | None
    recent_resumes: list[RecentResumeItem]
    recent_ats_scores: list[RecentAtsScoreItem]
    usage: UsageSummary
