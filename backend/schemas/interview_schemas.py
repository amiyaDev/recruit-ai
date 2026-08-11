import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from core.constants import InterviewDifficulty, InterviewSessionStatus, QuestionType


class InterviewGenerateRequest(BaseModel):
    resume_id: uuid.UUID | None = None
    job_id: uuid.UUID | None = None
    difficulty: InterviewDifficulty = InterviewDifficulty.MEDIUM


class InterviewAnswerRequest(BaseModel):
    question_id: uuid.UUID
    answer: str = Field(min_length=1)


class InterviewQuestionResponse(BaseModel):
    id: uuid.UUID
    question_text: str
    question_type: QuestionType
    user_answer: str | None
    ai_feedback: str | None
    ideal_answer: str | None  # NEW
    score: float | None
    class Config:
        from_attributes = True


class InterviewSessionResponse(BaseModel):
    id: uuid.UUID
    resume_id: uuid.UUID | None
    job_id: uuid.UUID | None
    difficulty: InterviewDifficulty
    status: InterviewSessionStatus
    overall_score: float | None
    questions: list[InterviewQuestionResponse]
    created_at: datetime

    class Config:
        from_attributes = True


class InterviewSessionListResponse(BaseModel):
    id: uuid.UUID
    resume_id: uuid.UUID | None
    job_id: uuid.UUID | None
    difficulty: InterviewDifficulty
    status: InterviewSessionStatus
    overall_score: float | None
    created_at: datetime

    class Config:
        from_attributes = True
