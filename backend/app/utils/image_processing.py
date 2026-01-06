"""
Image preprocessing utilities
画像前処理ユーティリティ
"""

from PIL import Image
import numpy as np
from io import BytesIO
import logging
from typing import Tuple, Optional

logger = logging.getLogger(__name__)

class ImageProcessor:
    """Handle all image preprocessing for the model"""
    
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        self.target_size = target_size
        self.supported_formats = {'PNG', 'JPEG', 'JPG', 'WEBP'}
    
    def preprocess(self, image_bytes: bytes) -> Optional[np.ndarray]:
        """
        Preprocess image for model prediction
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            np.ndarray: Preprocessed image array (1, 224, 224, 3)
        """
        try:
            # Validate input
            if not image_bytes or len(image_bytes) == 0:
                logger.error("Empty image bytes received")
                return None
            
            logger.info(f"Processing image: {len(image_bytes)} bytes")
            
            # Create BytesIO from bytes
            image_io = BytesIO(image_bytes)
            
            # Open image
            image = Image.open(image_io)
            
            # Log original format
            logger.info(f"Original image: format={image.format}, mode={image.mode}, size={image.size}")
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                logger.info(f"Converting from {image.mode} to RGB")
                image = image.convert('RGB')
            
            # Validate dimensions
            if image.size[0] < 50 or image.size[1] < 50:
                logger.error(f"Image too small: {image.size}")
                return None
            
            # Resize to target size
            logger.info(f"Resizing from {image.size} to {self.target_size}")
            image = image.resize(self.target_size, Image.LANCZOS)
            
            # Convert to numpy array
            img_array = np.array(image, dtype=np.float32)
            logger.info(f"Array shape after conversion: {img_array.shape}")
            
            # Normalize to [0, 1]
            img_array = img_array / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            logger.info(f"✅ Final preprocessed shape: {img_array.shape}, dtype: {img_array.dtype}")
            
            return img_array
            
        except Exception as e:
            logger.error(f"❌ Image preprocessing failed: {e}", exc_info=True)
            return None
    
    def get_image_info(self, image_bytes: bytes) -> dict:
        """
        Get image metadata
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            dict: Image information
        """
        try:
            image_io = BytesIO(image_bytes)
            image = Image.open(image_io)
            
            return {
                "format": image.format,
                "mode": image.mode,
                "size": image.size,
                "width": image.width,
                "height": image.height,
                "file_size_kb": len(image_bytes) / 1024
            }
        except Exception as e:
            logger.error(f"Failed to get image info: {e}")
            return {}


# Global instance
image_processor = ImageProcessor()