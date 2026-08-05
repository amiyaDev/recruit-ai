import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from api.dependencies.database import get_db
from core.exceptions import UnauthorizedError
from core.security import decode_access_token
from models.user import User
from repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(token)
    except jwt.PyJWTError:
        raise UnauthorizedError("Invalid or expired access token")

    user = UserRepository.get_by_id(db, payload["sub"])
    if not user or not user.is_active:
        raise UnauthorizedError("Invalid or expired access token")

    return user
