from fastapi import FastAPI

from api.router import api_router
from core.config import settings
from database.session import engine
from models.base import Base
from api.middleware.error_handler import app_error_handler
from core.exceptions import AppError

app = FastAPI(title=settings.APP_NAME)
app.add_exception_handler(AppError, app_error_handler)



app.include_router(
    api_router,
    prefix=f"/api/{settings.API_VERSION}",
)