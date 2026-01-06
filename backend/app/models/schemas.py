"""
Pydantic models for request/response validation
データ検証用のPydanticモデル
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional
from datetime import datetime

# ============================================
# Request Models
# ============================================

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    app_name: str
    version: str
    model_loaded: bool
    timestamp: datetime


# ============================================
# Response Models
# ============================================

class PreparationStep(BaseModel):
    """Bilingual preparation step"""
    japanese: str
    english: str


class PredictionResult(BaseModel):
    """Complete prediction result with Japanese rules"""
    
    # Prediction
    predicted_class: str = Field(..., description="Predicted garbage category")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Prediction confidence (0-1)")
    confidence_percentage: str = Field(..., description="Confidence as percentage string")
    
    # Bilingual Classification
    japanese_name: str = Field(..., description="Japanese category name (Kanji)")
    hiragana: str = Field(..., description="Japanese category name (Hiragana)")
    english_name: str = Field(..., description="English category name")
    
    # Description
    description_ja: str
    description_en: str
    
    # Examples
    examples_ja: List[str]
    examples_en: List[str]
    
    # Collection Information
    collection_day_ja: str = Field(..., description="Collection day in Japanese")
    collection_day_en: str = Field(..., description="Collection day in English")
    collection_frequency: str = Field(..., description="weekly, biweekly, monthly")
    
    # Preparation Steps (Bilingual)
    preparation_steps: List[PreparationStep]
    
    # Important Notes (Bilingual)
    notes_ja: List[str]
    notes_en: List[str]
    
    # Visual
    color: str = Field(..., description="Category color code")
    icon: str = Field(..., description="Emoji icon")
    
    # All probabilities for transparency
    all_probabilities: Dict[str, float] = Field(..., description="Probabilities for all classes")
    
    # User Action
    needs_confirmation: bool = Field(..., description="True if confidence < threshold")
    confidence_level: str = Field(..., description="high, medium, low")
    
    # Metadata
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    @validator('confidence_percentage', always=True)
    def format_confidence(cls, v, values):
        """Format confidence as percentage"""
        if 'confidence' in values:
            return f"{values['confidence'] * 100:.1f}%"
        return "0.0%"
    
    @validator('confidence_level', always=True)
    def determine_confidence_level(cls, v, values):
        """Determine confidence level"""
        if 'confidence' not in values:
            return "unknown"
        
        confidence = values['confidence']
        if confidence >= 0.80:
            return "high"
        elif confidence >= 0.60:
            return "medium"
        else:
            return "low"


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MultiLanguageResponse(BaseModel):
    """Response with multiple language support"""
    success: bool
    data: Optional[PredictionResult] = None
    error: Optional[str] = None
    language: str = Field(default="both", description="ja, en, or both")