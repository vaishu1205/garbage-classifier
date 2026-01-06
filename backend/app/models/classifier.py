"""
Garbage Classification Model Wrapper
ゴミ分類モデルのラッパー
"""

import tensorflow as tf
import numpy as np
from pathlib import Path
import logging
from typing import Dict, Tuple, Optional
import time

from app.core.config import settings

logger = logging.getLogger(__name__)

class GarbageClassifier:
    """
    Wrapper for TensorFlow garbage classification model
    Thread-safe, singleton pattern
    """
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self.model: Optional[tf.keras.Model] = None
        self.class_names = ['glass', 'metal', 'organic', 'paper', 'plastic']
        self.model_path = Path(settings.MODEL_PATH)
        self.confidence_threshold = settings.CONFIDENCE_THRESHOLD
        self._initialized = True
        
        # Load model on initialization
        self.load_model()
    
    def load_model(self) -> bool:
        """
        Load the TensorFlow model
        
        Returns:
            bool: True if successful
        """
        try:
            if not self.model_path.exists():
                logger.error(f"Model file not found: {self.model_path}")
                raise FileNotFoundError(f"Model not found at {self.model_path}")
            
            logger.info(f"Loading model from {self.model_path}...")
            start_time = time.time()
            
            # Load model
            self.model = tf.keras.models.load_model(str(self.model_path))
            
            load_time = (time.time() - start_time) * 1000
            logger.info(f"✅ Model loaded successfully in {load_time:.2f}ms")
            
            # Log model info
            logger.info(f"Model input shape: {self.model.input_shape}")
            logger.info(f"Model output shape: {self.model.output_shape}")
            logger.info(f"Number of classes: {len(self.class_names)}")
            
            # Warm up model (first prediction is always slower)
            self._warmup()
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self.model = None
            return False
    
    def _warmup(self):
        """Warm up model with dummy prediction"""
        try:
            dummy_input = np.random.random((1, 224, 224, 3)).astype(np.float32)
            _ = self.model.predict(dummy_input, verbose=0)
            logger.info("Model warmed up with dummy prediction")
        except Exception as e:
            logger.warning(f"Model warmup failed: {e}")
    
    def predict(self, image_array: np.ndarray) -> Tuple[str, float, Dict[str, float]]:
        """
        Make prediction on preprocessed image
        
        Args:
            image_array: Preprocessed image (1, 224, 224, 3)
            
        Returns:
            Tuple of (predicted_class, confidence, all_probabilities)
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        try:
            start_time = time.time()
            
            # Predict
            predictions = self.model.predict(image_array, verbose=0)[0]
            
            # Get predicted class
            predicted_idx = np.argmax(predictions)
            predicted_class = self.class_names[predicted_idx]
            confidence = float(predictions[predicted_idx])
            
            # All probabilities
            all_probs = {
                self.class_names[i]: float(predictions[i])
                for i in range(len(self.class_names))
            }
            
            inference_time = (time.time() - start_time) * 1000
            logger.info(
                f"Prediction: {predicted_class} ({confidence*100:.1f}%) "
                f"in {inference_time:.2f}ms"
            )
            
            return predicted_class, confidence, all_probs
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def get_model_info(self) -> dict:
        """Get model information"""
        if not self.is_loaded():
            return {"status": "not_loaded"}
        
        return {
            "status": "loaded",
            "input_shape": str(self.model.input_shape),
            "output_shape": str(self.model.output_shape),
            "classes": self.class_names,
            "num_classes": len(self.class_names),
            "model_path": str(self.model_path),
            "confidence_threshold": self.confidence_threshold
        }


# Global classifier instance (singleton)
classifier = GarbageClassifier()