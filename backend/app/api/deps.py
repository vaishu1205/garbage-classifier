"""
API dependencies and dependency injection
API依存性注入
"""

from fastapi import HTTPException, UploadFile
import logging

from app.models.classifier import classifier
from app.utils.image_processing import image_processor

logger = logging.getLogger(__name__)

async def validate_image_file(file: UploadFile) -> bytes:
    """
    Validate uploaded image file
    
    Args:
        file: Uploaded file
        
    Returns:
        bytes: File content
        
    Raises:
        HTTPException: If validation fails
    """
    # Check content type
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Must be an image."
        )
    
    # Check file size (max 10MB)
    content = await file.read()
    file_size_mb = len(content) / (1024 * 1024)
    
    if file_size_mb > 10:
        raise HTTPException(
            status_code=400,
            detail=f"File too large: {file_size_mb:.2f}MB. Max 10MB allowed."
        )
    
    if len(content) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file uploaded"
        )
    
    logger.info(f"File validated: {file.filename}, size={file_size_mb:.2f}MB")
    
    return content


def get_classifier():
    """
    Get classifier instance
    
    Raises:
        HTTPException: If model not loaded
    """
    if not classifier.is_loaded():
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Server is starting up."
        )
    return classifier


def get_image_processor():
    """Get image processor instance"""
    return image_processor