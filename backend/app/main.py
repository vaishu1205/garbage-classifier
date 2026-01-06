"""
Japanese Garbage Classifier API
日本のゴミ分類API

Production-grade FastAPI application with ML model serving
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import time
import logging

from app.core.config import settings
from app.core.logging_config import setup_logging
from app.models.classifier import classifier
from app.api.routes import health, predict

# Setup logging
logger = setup_logging(settings.LOG_LEVEL)

# ============================================
# Lifespan Events (Startup/Shutdown)
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events for FastAPI
    Handles startup and shutdown logic
    """
    # ========== STARTUP ==========
    logger.info("="*60)
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info("="*60)
    
    # Load ML model
    logger.info("Loading ML model...")
    if classifier.is_loaded():
        logger.info("✅ Model loaded successfully")
        logger.info(f"Model info: {classifier.get_model_info()}")
    else:
        logger.error("❌ Failed to load model")
    
    logger.info("="*60)
    logger.info("✅ Application startup complete")
    logger.info(f"API available at: http://{settings.HOST}:{settings.PORT}")
    logger.info(f"Docs available at: http://{settings.HOST}:{settings.PORT}/docs")
    logger.info("="*60)
    
    yield  # Application runs
    
    # ========== SHUTDOWN ==========
    logger.info("="*60)
    logger.info("Shutting down application...")
    logger.info("✅ Cleanup complete")
    logger.info("="*60)


# ============================================
# FastAPI Application
# ============================================

app = FastAPI(
    title=settings.APP_NAME,
    description="""
    🗑️ **Japanese Garbage Classification API**
    
    AI-powered waste classification system for Japanese garbage segregation.
    
    ## Features
    
    * 🎯 **86.20% Accuracy** across 5 garbage categories
    * 🇯🇵 **Bilingual Support** - Japanese and English
    * ⚡ **Fast Inference** - < 100ms prediction time
    * 📋 **Complete Rules** - Collection days, preparation steps
    * 🔒 **Production Ready** - Proper validation, logging, error handling
    
    ## Categories
    
    1. **Glass (びん・缶)** - Glass bottles and cans
    2. **Metal (金属ごみ)** - Small metal items
    3. **Organic (燃えるごみ)** - Burnable waste
    4. **Paper (紙類)** - Paper and cardboard
    5. **Plastic (プラスチック)** - Plastic containers
    
    ## Usage
    
    1. Upload an image of garbage item
    2. Get instant classification with confidence score
    3. Receive bilingual disposal instructions
    4. Follow Japanese collection schedule
    
    ## Model Performance
    
    | Category | Accuracy | Collection |
    |----------|----------|------------|
    | Metal    | 90.32%   | Monthly    |
    | Paper    | 92.05%   | Weekly     |
    | Plastic  | 87.67%   | Weekly     |
    | Glass    | 76.32%   | Bi-weekly  |
    | Organic  | 63.64%   | 2-3x/week  |
    
    Built with ❤️ for cleaner Japan
    """,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ============================================
# Middleware
# ============================================

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing"""
    start_time = time.time()
    
    # Log request
    logger.info(f"➡️  {request.method} {request.url.path}")
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = (time.time() - start_time) * 1000
    
    # Log response
    logger.info(
        f"⬅️  {request.method} {request.url.path} "
        f"| Status: {response.status_code} | {duration:.2f}ms"
    )
    
    # Add custom header
    response.headers["X-Process-Time"] = f"{duration:.2f}ms"
    
    return response

# ============================================
# Exception Handlers
# ============================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "body": str(exc.body)
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc) if settings.ENVIRONMENT == "development" else "An error occurred"
        }
    )

# ============================================
# Routes
# ============================================

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(predict.router, prefix="/api/v1", tags=["Classification"])

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API information
    """
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "model_loaded": classifier.is_loaded(),
        "docs": "/docs",
        "health": "/api/v1/health",
        "predict": "/api/v1/predict",
        "message": "Welcome to Japanese Garbage Classifier API! 🗑️🇯🇵"
    }

# API v1 info
@app.get("/api/v1", tags=["Root"])
async def api_v1_info():
    """API v1 information"""
    return {
        "version": "1.0",
        "endpoints": {
            "health": "/api/v1/health",
            "model_info": "/api/v1/model-info",
            "predict": "/api/v1/predict",
            "batch_predict": "/api/v1/predict/batch (coming soon)"
        },
        "supported_categories": classifier.class_names if classifier.is_loaded() else [],
        "model_accuracy": "86.20%"
    }


# ============================================
# Run Server (for development)
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True if settings.ENVIRONMENT == "development" else False,
        log_level=settings.LOG_LEVEL.lower()
    )