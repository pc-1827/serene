import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
import io
import os

from core.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Video Emotion Analysis Service is running"}

@patch("core.main.tempfile.NamedTemporaryFile")
@patch("core.main.BackgroundTasks")
def test_analyze_video(mock_background_tasks, mock_named_temp_file):
    # Mock temporary file
    mock_temp_file = MagicMock()
    mock_temp_file.__enter__.return_value.name = "/tmp/test.mp4"
    mock_named_temp_file.return_value = mock_temp_file
    
    # Create a dummy video file
    dummy_video = io.BytesIO(b"dummy video content")
    
    # Test the analyze_video endpoint
    response = client.post(
        "/video/analyze?user_id=1",
        files={"file": ("test.mp4", dummy_video, "video/mp4")}
    )
    
    # Verify response
    assert response.status_code == 200
    assert response.json()["status"] == "processing"
    assert response.json()["user_id"] == 1
    assert "video_id" in response.json()
    
    # Verify background task was added
    assert mock_background_tasks.add_task.called