from fastapi import APIRouter

from api.v1.endpoints.auth import router as auth_router
from api.v1.endpoints.users import router as user_router
from api.v1.endpoints.resumes import router as resume_router
from api.v1.endpoints.jobs import router as job_router
from api.v1.endpoints.ats import router as ats_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(user_router, prefix="/users", tags=["Users"])
api_router.include_router(resume_router, prefix="/resumes", tags=["Resumes"])
api_router.include_router(job_router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(ats_router, prefix="/ats", tags=["ATS"])