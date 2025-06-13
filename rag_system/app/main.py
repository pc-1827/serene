from fastapi import FastAPI
from app.api.endpoints import router as api_router

app = FastAPI(
    title="Serene RAG Backend",
    description="RAG-powered resource recommendation and sentiment analysis API for mental health support.",
    version="1.0.0"
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
