from sqlalchemy.orm import Session

from core.exceptions import ConflictError
from models.user import User
from repositories.user_repository import UserRepository
from schemas.user_schemas import UserUpdate


class UserService:

    @staticmethod
    def update_profile(db: Session, user: User, data: UserUpdate) -> User:
        updates = data.model_dump(exclude_unset=True)

        if "email" in updates and updates["email"] != user.email:
            if UserRepository.get_by_email(db, updates["email"]):
                raise ConflictError("An account with this email already exists")

        return UserRepository.update(db, user, updates)