from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import api_router
from core.config import settings
from database.session import engine
from models.base import Base
from api.middleware.error_handler import app_error_handler
from api.middleware.response_handler import ResponseMiddleware

from core.exceptions import AppError

app = FastAPI(title=settings.APP_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ResponseMiddleware)
app.add_exception_handler(AppError, app_error_handler)



app.include_router(
    api_router,
    prefix=f"/api/{settings.API_VERSION}",
)