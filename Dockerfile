# Use Python 3.13 slim image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend
COPY backend/ .

# Expose port (Railway sets PORT env variable)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get(f'http://localhost:{os.environ.get(\"PORT\", 8000)}/api/v1/health', timeout=5)"

# Run the application
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
