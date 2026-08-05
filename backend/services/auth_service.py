from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from core.config import settings
from core.constants import UserRole
from core.exceptions import ConflictError, UnauthorizedError
from core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from models.user import User
from repositories.refresh_token_repository import RefreshTokenRepository
from repositories.user_repository import UserRepository
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse


def _issue_tokens(db: Session, user: User) -> TokenResponse:
    access_token = create_access_token(str(user.id), user.role.value)

    raw_refresh_token = generate_refresh_token()
    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    RefreshTokenRepository.create(
        db,
        user_id=user.id,
        token_hash=hash_refresh_token(raw_refresh_token),
        expires_at=expires_at,
    )

    return TokenResponse(access_token=access_token, refresh_token=raw_refresh_token)


class AuthService:

    @staticmethod
    def register(db: Session, data: RegisterRequest) -> User:
        if UserRepository.get_by_email(db, data.email):
            raise ConflictError("An account with this email already exists")

        return UserRepository.create(
            db,
            {
                "name": data.name,
                "email": data.email,
                "hashed_password": hash_password(data.password),
                "role": UserRole.USER,
            },
        )

    @staticmethod
    def login(db: Session, data: LoginRequest) -> TokenResponse:
        user = UserRepository.get_by_email(db, data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedError("Invalid email or password")
        if not user.is_active:
            raise UnauthorizedError("This account is deactivated")

        return _issue_tokens(db, user)

    @staticmethod
    def refresh(db: Session, raw_refresh_token: str) -> TokenResponse:
        token_hash = hash_refresh_token(raw_refresh_token)
        stored_token = RefreshTokenRepository.get_valid_by_hash(db, token_hash)
        if not stored_token:
            raise UnauthorizedError("Invalid or expired refresh token")

        user = UserRepository.get_by_id(db, stored_token.user_id)
        if not user or not user.is_active:
            raise UnauthorizedError("Invalid or expired refresh token")

        RefreshTokenRepository.revoke(db, stored_token)
        return _issue_tokens(db, user)

    @staticmethod
    def logout(db: Session, raw_refresh_token: str) -> None:
        token_hash = hash_refresh_token(raw_refresh_token)
        stored_token = RefreshTokenRepository.get_valid_by_hash(db, token_hash)
        if stored_token:
            RefreshTokenRepository.revoke(db, stored_token)
