"""
Prediction endpoints
予測エンドポイント
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from typing import Optional
import logging
import time

from app.models.schemas import PredictionResult, ErrorResponse
from app.models.classifier import classifier
from app.utils.image_processing import image_processor
from app.api.deps import validate_image_file, get_classifier, get_image_processor
from app.core.garbage_rules import GARBAGE_RULES

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/predict", response_model=PredictionResult, tags=["Classification"])
async def predict_garbage(
    file: UploadFile = File(..., description="Image file to classify"),
    language: str = Query("both", regex="^(ja|en|both)$", description="Response language")
):
    """
    Classify garbage image
    
    Upload an image and get classification with Japanese garbage rules.
    
    **Parameters:**
    - **file**: Image file (JPEG, PNG, WEBP)
    - **language**: Response language (ja=Japanese, en=English, both=Bilingual)
    
    **Returns:**
    - Predicted category with confidence
    - Bilingual collection rules
    - Preparation instructions
    - All class probabilities
    """
    start_time = time.time()
    
    try:
        # Validate file
        image_bytes = await validate_image_file(file)
        logger.info(f"Processing file: {file.filename}")
        
        # Preprocess image
        img_processor = get_image_processor()
        image_array = img_processor.preprocess(image_bytes)
        
        if image_array is None:
            raise HTTPException(
                status_code=400,
                detail="Failed to process image. Please upload a valid image file."
            )
        
        # Get classifier
        clf = get_classifier()
        
        # Predict
        predicted_class, confidence, all_probs = clf.predict(image_array)
        
        # Get garbage rules
        if predicted_class not in GARBAGE_RULES:
            raise HTTPException(
                status_code=500,
                detail=f"Unknown category returned: {predicted_class}"
            )
        
        rule = GARBAGE_RULES[predicted_class]
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        # Build response
        result = PredictionResult(
            # Prediction
            predicted_class=predicted_class,
            confidence=confidence,
            confidence_percentage=f"{confidence*100:.1f}%",
            
            # Bilingual names
            japanese_name=rule.japanese_name,
            hiragana=rule.hiragana,
            english_name=rule.english_name,
            
            # Descriptions
            description_ja=rule.description_ja,
            description_en=rule.description_en,
            
            # Examples
            examples_ja=rule.examples_ja,
            examples_en=rule.examples_en,
            
            # Collection
            collection_day_ja=rule.collection_day_ja,
            collection_day_en=rule.collection_day_en,
            collection_frequency=rule.collection_frequency,
            
            # Preparation
            preparation_steps=[
                {"japanese": step.japanese, "english": step.english}
                for step in rule.preparation_steps
            ],
            
            # Notes
            notes_ja=rule.notes_ja,
            notes_en=rule.notes_en,
            
            # Visual
            color=rule.color,
            icon=rule.icon,
            
            # Probabilities
            all_probabilities=all_probs,
            
            # Confidence check
            needs_confirmation=confidence < clf.confidence_threshold,
            confidence_level="high" if confidence >= 0.80 else "medium" if confidence >= 0.60 else "low",
            
            # Metadata
            processing_time_ms=processing_time
        )
        
        logger.info(
            f"✅ Prediction complete: {predicted_class} "
            f"({confidence*100:.1f}%) in {processing_time:.2f}ms"
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/predict/batch", tags=["Classification"])
async def predict_batch():
    """
    Batch prediction endpoint (future feature)
    
    For processing multiple images at once.
    """
    return {
        "message": "Batch prediction not yet implemented",
        "status": "coming_soon"
    }