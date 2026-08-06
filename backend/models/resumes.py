import uuid

from sqlalchemy import Column,DateTime, Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from core.constants import ResumeFileType, ResumeStatus
from models.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(Enum(ResumeFileType), nullable=False)
    raw_text = Column(String, nullable=True)
    parsed_data = Column(JSONB, nullable=True)
    status = Column(Enum(ResumeStatus), nullable=False, default=ResumeStatus.UPLOADED)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())