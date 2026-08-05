import uuid

from sqlalchemy.orm import Session

from models.user import User


class UserRepository:

    @staticmethod
    def create(db: Session, user_data: dict) -> User:
        user = User(**user_data)

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_id(db: Session, user_id: uuid.UUID) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update(db: Session, user: User, updates: dict) -> User:
        for field, value in updates.items():
            setattr(user, field, value)

        db.add(user)
        db.commit()
        db.refresh(user)

        return user
