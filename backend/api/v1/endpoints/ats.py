import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from api.dependencies.auth import get_current_user
from api.dependencies.database import get_db
from models.user import User
from schemas.ats_schemas import ATSAnalyzeRequest, ATSScoreResponse
from services.ats_service import ATSService

router = APIRouter()


@router.post("/analyze", response_model=ATSScoreResponse, status_code=status.HTTP_201_CREATED)
async def analyze(
    data: ATSAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ATSService.analyze(db, current_user.id, data.resume_id, data.job_id)


@router.get("/{ats_id}", response_model=ATSScoreResponse)
async def get_score(
    ats_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ATSService.get_owned(db, current_user.id, ats_id)


@router.get("/resume/{resume_id}", response_model=list[ATSScoreResponse])
async def list_for_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ATSService.list_for_resume(db, current_user.id, resume_id)