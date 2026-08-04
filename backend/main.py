from fastapi import FastAPI

from api.router import api_router
from core.config import settings
from database.database import engine
from models.base import Base

app = FastAPI(title=settings.APP_NAME)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


app.include_router(
    api_router,
    prefix=f"/api/{settings.API_VERSION}",
)