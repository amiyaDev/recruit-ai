from repositories.user_repository import UserRepository


class UserService:

    @staticmethod
    def create_user(db, user):
        return UserRepository.create(
            db,
            user.model_dump(),
        )