"""
Health check endpoints
ヘルスチェックエンドポイント
"""

from fastapi import APIRouter, Depends
from datetime import datetime

from app.models.schemas import HealthResponse
from app.models.classifier import classifier
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint
    
    Returns API status and model loading status
    """
    return HealthResponse(
        status="healthy" if classifier.is_loaded() else "degraded",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        model_loaded=classifier.is_loaded(),
        timestamp=datetime.utcnow()
    )


@router.get("/model-info", tags=["Health"])
async def model_info():
    """Get detailed model information"""
    return classifier.get_model_info()