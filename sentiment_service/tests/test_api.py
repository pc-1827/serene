import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

from core.main import app
from core.database import Base, get_db
from core.models import User, ChatMessage, SentimentScore, VideoSentiment

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
    assert response.json() == {"message": "Sentiment Analysis Service"}

def test_store_chat_sentiment(test_db):
    # Create test data
    test_data = {
        "user_id": 1,
        "chat_message_id": 1,
        "sentiments": {
            "Happy": 0.4,
            "Sad": 0.3,
            "Anxious": 0.6
        },
        "language": "en"
    }
    
    # Test API endpoint
    response = client.post("/sentiment/chat", json=test_data)
    
    # Verify response
    assert response.status_code == 200
    assert response.json() == {"message": "Sentiment scores stored successfully"}
    
    # Verify data was stored in database
    db = TestingSessionLocal()
    scores = db.query(SentimentScore).filter(SentimentScore.user_id == 1).all()
    assert len(scores) == 3  # Happy, Sad, Anxious
    db.close()

def test_store_video_emotions(test_db):
    # Create test user
    db = TestingSessionLocal()
    user = User(id=1, email="test@example.com")
    db.add(user)
    db.commit()
    db.close()
    
    # Create test data
    test_data = {
        "user_id": 1,
        "video_id": "test-video-uuid",
        "emotions": {
            "happy": 10,
            "sad": 5,
            "neutral": 20
        }
    }
    
    # Test API endpoint
    response = client.post("/sentiment/video", json=test_data)
    
    # Verify response
    assert response.status_code == 200
    assert response.json()["message"] == "Video emotions stored successfully"
    
    # Verify data was stored in database
    db = TestingSessionLocal()
    emotions = db.query(VideoSentiment).filter(VideoSentiment.user_id == 1).all()
    assert len(emotions) == 3  # happy, sad, neutral
    
    # Check percentages
    total = 35  # 10 + 5 + 20
    for emotion in emotions:
        if emotion.emotion == "happy":
            assert emotion.percentage == (10 / total) * 100
        elif emotion.emotion == "sad":
            assert emotion.percentage == (5 / total) * 100
        elif emotion.emotion == "neutral":
            assert emotion.percentage == (20 / total) * 100
    
    db.close()