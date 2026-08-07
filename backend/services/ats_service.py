import json
import uuid

from sqlalchemy.orm import Session

from core.constants import JOBS_COLLECTION, LLMFeature, RESUMES_COLLECTION
from core.exceptions import AppError, NotFoundError, ValidationError
from models.ats_score import ATSScore
from repositories.ats_repository import ATSRepository
from repositories.job_repository import JobRepository
from repositories.resume_repository import ResumeRepository
from services.embedding_service import cosine_similarity, get_vector
from services.llm.openai_provider import OpenAIProvider
from services.usage_tracker import ensure_budget_available, record_usage


def _build_prompt(skills: list[str], job_title: str, job_keywords: list[str], missing_keywords: list[str], similarity: float) -> str:
    return f"""You are an ATS (Applicant Tracking System) resume reviewer.

Resume skills: {', '.join(skills) or 'none detected'}
Job title: {job_title}
Job required keywords: {', '.join(job_keywords) or 'none'}
Missing keywords (in job, not in resume): {', '.join(missing_keywords) or 'none'}
Semantic similarity score: {similarity:.2f} (0 to 1 scale)

Give 3-5 short, specific, actionable suggestions to improve this resume for this job.
Respond ONLY as JSON in this exact shape: {{"suggestions": ["...", "..."]}}
"""


class ATSService:

    @staticmethod
    def analyze(db: Session, user_id: uuid.UUID, resume_id: uuid.UUID, job_id: uuid.UUID) -> ATSScore:
        resume = ResumeRepository.get_by_id(db, resume_id)
        if not resume or resume.user_id != user_id:
            raise NotFoundError("Resume not found")

        job = JobRepository.get_by_id(db, job_id)
        if not job or job.created_by != user_id:
            raise NotFoundError("Job not found")

        ensure_budget_available(db)

        resume_vector = get_vector(RESUMES_COLLECTION, resume.id)
        job_vector = get_vector(JOBS_COLLECTION, job.id)
        if not resume_vector or not job_vector:
            raise ValidationError("Resume or job hasn't finished embedding yet — try again shortly")

        similarity = cosine_similarity(resume_vector, job_vector)

        resume_skills = set((resume.parsed_data or {}).get("skills", []))
        job_keywords = set(job.extracted_keywords or [])
        missing_keywords = sorted(job_keywords - resume_skills)

        if job_keywords:
            keyword_coverage = (len(job_keywords) - len(missing_keywords)) / len(job_keywords)
            score = round((0.6 * similarity + 0.4 * keyword_coverage) * 100, 2)
        else:
            score = round(similarity * 100, 2)

        try:
            prompt = _build_prompt(
                sorted(resume_skills), job.title, sorted(job_keywords), missing_keywords, similarity
            )
            response_text, input_tokens, output_tokens = OpenAIProvider().generate(prompt)
            record_usage(db, user_id, LLMFeature.ATS_SUGGESTIONS, input_tokens, output_tokens)
            suggestions = json.loads(response_text).get("suggestions", [])
        except Exception:
            raise AppError("Failed to generate ATS suggestions, please try again")

        return ATSRepository.create(
            db,
            {
                "resume_id": resume.id,
                "job_id": job.id,
                "score": score,
                "missing_keywords": missing_keywords,
                "suggestions": suggestions,
            },
        )

    @staticmethod
    def get_owned(db: Session, user_id: uuid.UUID, ats_id: uuid.UUID) -> ATSScore:
        score = ATSRepository.get_by_id(db, ats_id)
        if not score:
            raise NotFoundError("ATS score not found")
        resume = ResumeRepository.get_by_id(db, score.resume_id)
        if not resume or resume.user_id != user_id:
            raise NotFoundError("ATS score not found")
        return score

    @staticmethod
    def list_for_resume(db: Session, user_id: uuid.UUID, resume_id: uuid.UUID) -> list[ATSScore]:
        resume = ResumeRepository.get_by_id(db, resume_id)
        if not resume or resume.user_id != user_id:
            raise NotFoundError("Resume not found")
        return ATSRepository.list_by_resume(db, resume_id)