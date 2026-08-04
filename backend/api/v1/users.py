from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from api.dependencies.database import get_db
from schemas.user_schemas import UserCreate
from services.user_service import UserService

router = APIRouter()


@router.post("/")
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return UserService.create_user(db, user)