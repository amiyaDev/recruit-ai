import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from models.refresh_token import RefreshToken


class RefreshTokenRepository:

    @staticmethod
    def create(db: Session, user_id: uuid.UUID, token_hash: str, expires_at: datetime) -> RefreshToken:
        refresh_token = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        db.add(refresh_token)
        db.commit()
        db.refresh(refresh_token)

        return refresh_token

    @staticmethod
    def get_valid_by_hash(db: Session, token_hash: str) -> RefreshToken | None:
        return (
            db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == token_hash,
                RefreshToken.revoked.is_(False),
                RefreshToken.expires_at > datetime.now(timezone.utc),
            )
            .first()
        )

    @staticmethod
    def revoke(db: Session, refresh_token: RefreshToken) -> None:
        refresh_token.revoked = True
        db.add(refresh_token)
        db.commit()
