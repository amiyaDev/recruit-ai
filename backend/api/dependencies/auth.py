import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from api.dependencies.database import get_db
from core.exceptions import UnauthorizedError
from core.security import decode_access_token
from models.user import User
from repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise UnauthorizedError("Invalid or expired access token")

    user = UserRepository.get_by_id(db, payload["sub"])
    if not user or not user.is_active:
        raise UnauthorizedError("Invalid or expired access token")

    return user