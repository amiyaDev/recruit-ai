import uuid

from sqlalchemy import Column, DateTime, Float, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB, UUID

from models.base import Base


class ATSScore(Base):
    __tablename__ = "ats_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False, index=True)
    score = Column(Float, nullable=False)
    missing_keywords = Column(JSONB, nullable=True)
    suggestions = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())