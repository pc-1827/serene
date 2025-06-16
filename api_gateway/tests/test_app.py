import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json

from core.app import create_app
from core.routes import register_routes

@pytest.fixture
def app():
    app = create_app()
    register_routes(app)
    return app

@pytest.fixture
def client(app):
    return TestClient(app)

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API Gateway is running"}

@patch("core.utils.httpx.AsyncClient")
def test_auth_proxy(mock_client, client):
    # Setup mock response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.content = json.dumps({"success": True}).encode()
    mock_response.headers = {"content-type": "application/json"}
    
    # Configure the mock client
    mock_async_client = MagicMock()
    mock_async_client.__aenter__.return_value.request.return_value = mock_response
    mock_client.return_value = mock_async_client
    
    # Test the proxy endpoint
    response = client.post("/auth/login", json={"username": "test", "password": "test"})
    
    # Verify response
    assert response.status_code == 200
    assert response.json() == {"success": True}

@patch("core.utils.httpx.AsyncClient")
def test_proxy_timeout(mock_client, client):
    # Setup mock to raise timeout
    mock_async_client = MagicMock()
    mock_async_client.__aenter__.return_value.request.side_effect = TimeoutError("Request timed out")
    mock_client.return_value = mock_async_client
    
    # Test the proxy endpoint with a timeout
    response = client.get("/chat/history/1")
    
    # Verify proper error response
    assert response.status_code == 500
    assert "error" in response.json()