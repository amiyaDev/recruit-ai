import uuid

from models.base import Base
from sqlalchemy import Column, DateTime, Enum,ForeignKey, String, func

from sqlalchemy.dialects.postgresql import JSONB,UUID
from core.constants import JobStatus


class Job(Base):
    __tablename__ = "jobs"    
    id= Column(UUID(as_uuid=True),primary_key=True , default=uuid.uuid4)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,index= True)
    title = Column(String, nullable=False)
    company= Column(String,nullable=True)
    description = Column(String, nullable=False)
    extracted_keywords = Column(JSONB, nullable=True)
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),
    server_default = func.now(), onupdate = func.now())