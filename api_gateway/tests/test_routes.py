import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json

from core.app import create_app
from core.routes import register_routes
from core.routes.auth import router as auth_router
from core.routes.chat import router as chat_router
from core.routes.sentiment import router as sentiment_router
from core.routes.voice import router as voice_router
from core.routes.video import router as video_router

@pytest.fixture
def app():
    app = create_app()
    return app

@pytest.fixture
def client(app):
    return TestClient(app)

def test_register_routes(app):
    # Test that all routers get registered properly
    register_routes(app)
    
    # Check if routes were registered by examining app.routes
    route_paths = [route.path for route in app.routes]
    
    # Check for representative routes from each service
    assert "/auth/{path:path}" in route_paths
    assert "/chat/{path:path}" in route_paths
    assert "/sentiment/{path:path}" in route_paths
    assert "/voice/{path:path}" in route_paths
    assert "/video/{path:path}" in route_paths