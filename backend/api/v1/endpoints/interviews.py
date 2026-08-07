import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from api.dependencies.auth import get_current_user
from api.dependencies.database import get_db
from models.user import User
from repositories.interview_repository import InterviewRepository
from schemas.interview_schemas import (
    InterviewAnswerRequest,
    InterviewGenerateRequest,
    InterviewQuestionResponse,
    InterviewSessionResponse,
)
from services.interview_service import InterviewService

router = APIRouter()


def _to_session_response(db: Session, session) -> InterviewSessionResponse:
    questions = InterviewRepository.get_questions_by_session(db, session.id)
    return InterviewSessionResponse(
        id=session.id,
        difficulty=session.difficulty,
        status=session.status,
        overall_score=session.overall_score,
        questions=[InterviewQuestionResponse.model_validate(q) for q in questions],
        created_at=session.created_at,
    )


@router.post("/generate", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
async def generate(
    data: InterviewGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = InterviewService.generate(db, current_user.id, data)
    return _to_session_response(db, session)


@router.get("/{session_id}", response_model=InterviewSessionResponse)
async def get_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = InterviewService.get_owned_session(db, current_user.id, session_id)
    return _to_session_response(db, session)


@router.post("/{session_id}/answer", status_code=status.HTTP_204_NO_CONTENT)
async def answer(
    session_id: uuid.UUID,
    data: InterviewAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    InterviewService.answer(db, current_user.id, session_id, data.question_id, data.answer)


@router.post("/{session_id}/evaluate", response_model=InterviewSessionResponse)
async def evaluate(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = InterviewService.evaluate(db, current_user.id, session_id)
    return _to_session_response(db, session)
