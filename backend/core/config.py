from pydantic_settings   import BaseSettings


class Settings(BaseSettings):
    API_VERSION: str = "v1"
    APP_NAME: str = "RecruitAI"

    DATABASE_URL: str

    class Config:
        env_file = ".env"


settings = Settings()