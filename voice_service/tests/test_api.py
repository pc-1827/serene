import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os
import io

from core.main import app, model

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Voice Service is running"}

@patch("core.main.model")
def test_transcribe_audio(mock_model, tmp_path):
    # Create mock for WhisperModel
    mock_segments = [MagicMock(text="This is a test")]
    mock_info = MagicMock(language="en")
    mock_model.transcribe.return_value = (mock_segments, mock_info)
    
    # Create a dummy audio file
    dummy_audio = io.BytesIO(b"dummy audio content")
    
    # Test the transcribe endpoint
    response = client.post(
        "/voice/transcribe",
        files={"file": ("test.wav", dummy_audio, "audio/wav")}
    )
    
    # Verify response
    assert response.status_code == 200
    assert response.json() == {"text": "This is a test", "language": "en"}

@patch("core.main.httpx.AsyncClient")
@patch("core.main.model")
def test_process_voice_message(mock_model, mock_httpx, tmp_path):
    # Mock the transcription
    mock_segments = [MagicMock(text="Hello world")]
    mock_info = MagicMock(language="en")
    mock_model.transcribe.return_value = (mock_segments, mock_info)
    
    # Mock the chatbot service response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "message_id": 1,
        "bot_message": "Hi there!",
        "sentiment_scores": []
    }
    
    # Configure the mock client
    mock_async_client = MagicMock()
    mock_async_client.__aenter__.return_value.post.return_value = mock_response
    mock_httpx.return_value = mock_async_client
    
    # Create a dummy audio file
    dummy_audio = io.BytesIO(b"dummy audio content")
    
    # Test the process_voice_message endpoint
    response = client.post(
        "/voice/chat/1",
        files={"file": ("test.wav", dummy_audio, "audio/wav")}
    )
    
    # Verify response
    assert response.status_code == 200
    assert response.json()["bot_message"] == "Hi there!"
    assert response.json()["transcribed_text"] == "Hello world"