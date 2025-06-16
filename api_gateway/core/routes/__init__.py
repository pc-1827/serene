from fastapi import FastAPI
from .auth import router as auth_router
from .sentiment import router as sentiment_router
from .chat import router as chat_router
from .voice import router as voice_router
from .video import router as video_router

def register_routes(app: FastAPI):
    """Register all route handlers with the application"""
    app.include_router(auth_router)
    app.include_router(sentiment_router)
    app.include_router(chat_router)
    app.include_router(voice_router)
    app.include_router(video_router)