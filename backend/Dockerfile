FROM python:3.11-slim

WORKDIR /app

# tesseract-ocr: OCR fallback for scanned/image-only PDFs with no text layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Create output directory
RUN mkdir -p output

# Default: run the FastAPI server
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
