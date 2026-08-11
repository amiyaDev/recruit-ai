import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from api.dependencies.auth import get_current_user
from api.dependencies.database import get_db
from models.user import User
from schemas.chat_schemas import ChatMessageCreate, ChatMessageResponse, ChatSessionCreate, ChatSessionResponse
from services.chat_service import ChatService

router = APIRouter()


@router.get("/sessions/", response_model=list[ChatSessionResponse])
async def list_sessions(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ChatService.list_sessions(db, current_user.id, skip, limit)


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ChatService.create_session(db, current_user.id, data.resume_id)


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    session_id: uuid.UUID,
    data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ChatService.send_message(db, current_user.id, session_id, data.content)


@router.get("/sessions/{session_id}", response_model=list[ChatMessageResponse])
async def get_session_messages(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ChatService.get_messages(db, current_user.id, session_id)


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ChatService.delete_session(db, current_user.id, session_id)

@router.post("/sessions/{session_id}/messages/stream")
async def send_message_stream(
    session_id: uuid.UUID,
    data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    generator = ChatService.send_message_stream(db, current_user.id, session_id, data.content)
    return StreamingResponse(generator, media_type="text/event-stream")