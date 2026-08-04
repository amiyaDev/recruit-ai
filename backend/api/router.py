from fastapi import APIRouter

from api.v1.users import router as user_router

api_router = APIRouter()

api_router.include_router(
    user_router,
    prefix="/users",
    tags=["Users"],
)