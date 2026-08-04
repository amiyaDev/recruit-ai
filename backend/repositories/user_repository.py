from sqlalchemy.orm import Session

from models.user import User


class UserRepository:

    @staticmethod
    def create(db: Session, user_data):
        user = User(**user_data)

        db.add(user)
        db.commit()
        db.refresh(user)

        return user