FROM python:3.11-slim

WORKDIR /app

# Install system dependencies - Add postgresql-dev packages
RUN apt-get update && \
    apt-get install -y gcc libpq-dev postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Remove .env file to avoid conflicts with environment variables
RUN rm -f .env || true

# Expose FastAPI port
EXPOSE 8001

# Start the FastAPI server
CMD ["uvicorn", "core.main:app", "--host", "0.0.0.0", "--port", "8001"]