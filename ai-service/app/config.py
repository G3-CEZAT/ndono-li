import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8000
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:cezat_secure_pass_2026@postgres:5432/cezat_db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "models/embedding-001")
    INTERNAL_AI_SECRET: str = os.getenv("INTERNAL_AI_SECRET", "cezat_internal_ai_token_2026")
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.72"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
