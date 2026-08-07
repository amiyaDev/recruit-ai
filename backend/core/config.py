from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_VERSION: str = "v1"
    APP_NAME: str = "RecruitAI"

    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    QDRANT_URL: str = "http://qdrant:6333"
    class Config:
        env_file = ".env"


settings = Settings()
