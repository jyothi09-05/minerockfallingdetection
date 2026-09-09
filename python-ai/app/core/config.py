import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MineMind AI Intelligence Service"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    JAVA_BACKEND_URL: str = os.getenv("JAVA_BACKEND_URL", "http://localhost:8080/api/v1")
    
    # Offline Local Storage Paths
    LOCAL_STORAGE_PATH: str = os.getenv("LOCAL_STORAGE_PATH", "./data/storage")
    TELEMETRY_DATA_PATH: str = os.getenv("TELEMETRY_DATA_PATH", "./data/telemetry")
    MODEL_STORAGE_PATH: str = os.getenv("MODEL_STORAGE_PATH", "./data/models")

    class Config:
        case_sensitive = True

settings = Settings()
