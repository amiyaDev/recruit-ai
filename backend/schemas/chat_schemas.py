import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from core.constants import ChatRole


class ChatSessionCreate(BaseModel):
    resume_id: uuid.UUID | None = None


class ChatMessageCreate(BaseModel):
    content: str = Field(min_length=1)


class ChatMessageResponse(BaseModel):
    id: uuid.UUID
    role: ChatRole
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatSessionResponse(BaseModel):
    id: uuid.UUID
    resume_id: uuid.UUID | None
    title: str | None
    created_at: datetime

    class Config:
        from_attributes = True
