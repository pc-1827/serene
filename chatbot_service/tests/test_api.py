import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

from core.main import app
from core.database import Base, get_db
from core.models import User, ChatMessage, SentimentScore
from core.schemas import MessageRequest

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency for testing
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def test_db():
    # Create the tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the tables after test
    Base.metadata.drop_all(bind=engine)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Chatbot Service is running"}

@patch("core.main.get_sentiment_analysis")
@patch("core.main.get_bot_response")
@patch("core.main.httpx.post")
def test_process_message(mock_httpx_post, mock_get_bot_response, mock_get_sentiment_analysis, test_db):
    # Setup mocks
    mock_get_sentiment_analysis.return_value = {
        "Happy": 0.4, "Sad": 0.3, "Anxious": 0.6
    }
    
    mock_get_bot_response.return_value = "This is a test response from the bot."
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_httpx_post.return_value = mock_response
    
    # Test message processing
    request_data = {
        "user_id": 1,
        "message": "Hello, I'm feeling a bit anxious today.",
        "language": "en"
    }
    
    response = client.post("/chat/message", json=request_data)
    
    # Verify response
    assert response.status_code == 200
    response_data = response.json()
    assert "message_id" in response_data
    assert "bot_message" in response_data
    assert response_data["bot_message"] == "This is a test response from the bot."
    assert "sentiment_scores" in response_data
    assert len(response_data["sentiment_scores"]) == 3  # Happy, Sad, Anxious