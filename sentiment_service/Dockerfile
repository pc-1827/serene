FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .

# Install packages with specific options to avoid compatibility issues
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose FastAPI port
EXPOSE 8002

# Start the FastAPI server
CMD ["uvicorn", "core.main:app", "--host", "0.0.0.0", "--port", "8002"]