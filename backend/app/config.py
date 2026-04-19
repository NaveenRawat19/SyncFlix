from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    SECRET_KEY: str = "change_me_to_a_random_secret"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./syncflix.db")
    CORS_ORIGINS: str = "http://localhost:5173"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALGORITHM: str = "HS256"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
