from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    APP_NAME: str = "Japanese Garbage Classifier API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", 8000))
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000"
    ]
    
    # Model
    MODEL_PATH: str = "models/garbage_classifier_final.keras"
    CONFIDENCE_THRESHOLD: float = 0.70
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_ENABLED: bool = False
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()