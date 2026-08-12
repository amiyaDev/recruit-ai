import uuid

from sqlalchemy.orm import Session

from core.config import settings
from repositories.ats_repository import ATSRepository
from repositories.chat_repository import ChatRepository
from repositories.interview_repository import InterviewRepository
from repositories.job_repository import JobRepository
from repositories.resume_repository import ResumeRepository
from schemas.dashboard_schemas import DashboardSummaryResponse, RecentAtsScoreItem, UsageSummary
from services.usage_tracker import get_total_spend


class DashboardService:

    @staticmethod
    def get_summary(db: Session, user_id: uuid.UUID) -> DashboardSummaryResponse:
        recent_scores = ATSRepository.list_recent_with_job_for_user(db, user_id, limit=5)
        spent = get_total_spend(db)
        budget = settings.MAX_LLM_SPEND_USD

        return DashboardSummaryResponse(
            resume_count=ResumeRepository.count_by_user(db, user_id),
            job_count=JobRepository.count_by_user(db, user_id),
            interview_count=InterviewRepository.count_by_user(db, user_id),
            chat_count=ChatRepository.count_sessions_by_user(db, user_id),
            avg_ats_score=ATSRepository.avg_score_for_user(db, user_id),
            recent_resumes=ResumeRepository.list_by_user(db, user_id, skip=0, limit=5),
            recent_ats_scores=[
                RecentAtsScoreItem(
                    id=score.id,
                    score=score.score,
                    job_title=job.title,
                    job_company=job.company,
                    created_at=score.created_at,
                )
                for score, job in recent_scores
            ],
            usage=UsageSummary(
                spent_usd=round(spent, 4),
                budget_usd=budget,
                percent=round(min(spent / budget, 1) * 100, 1) if budget else 0.0,
            ),
        )
