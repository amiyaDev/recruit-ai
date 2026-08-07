import uuid

from sqlalchemy.orm import Session

from models.chat import ChatMessage, ChatSession


class ChatRepository:

    @staticmethod
    def create_session(db: Session, data: dict) -> ChatSession:
        session = ChatSession(**data)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_session_by_id(db: Session, session_id: uuid.UUID) -> ChatSession | None:
        return db.query(ChatSession).filter(ChatSession.id == session_id).first()

    @staticmethod
    def create_message(db: Session, data: dict) -> ChatMessage:
        message = ChatMessage(**data)
        db.add(message)
        db.commit()
        db.refresh(message)
        return message

    @staticmethod
    def get_recent_messages(db: Session, session_id: uuid.UUID, limit: int) -> list[ChatMessage]:
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(limit)
            .all()
        )
        return list(reversed(messages))

    @staticmethod
    def get_all_messages(db: Session, session_id: uuid.UUID) -> list[ChatMessage]:
        return (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
            .all()
        )
