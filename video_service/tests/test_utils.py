import pytest
from unittest.mock import patch, MagicMock
import numpy as np
import cv2

from core.utils import process_video_frames, analyze_emotions

@patch("core.utils.cv2.VideoCapture")
def test_process_video_frames(mock_video_capture):
    # Mock VideoCapture
    mock_cap = MagicMock()
    mock_cap.isOpened.return_value = True
    
    # Set up mock to return 3 frames and then stop
    mock_cap.read.side_effect = [
        (True, np.zeros((480, 640, 3), dtype=np.uint8)),
        (True, np.zeros((480, 640, 3), dtype=np.uint8)),
        (True, np.zeros((480, 640, 3), dtype=np.uint8)),
        (False, None)
    ]
    
    mock_video_capture.return_value = mock_cap
    
    # Test with sample_rate=1 (process every frame)
    frames = process_video_frames("test.mp4", sample_rate=1)
    
    # Verify results
    assert len(frames) == 3
    assert mock_cap.release.called

@patch("core.utils.DeepFace.analyze")
@patch("core.utils.tempfile.NamedTemporaryFile")
@patch("core.utils.cv2.imwrite")
@patch("core.utils.os.unlink")
def test_analyze_emotions(mock_unlink, mock_imwrite, mock_temp_file, mock_deepface_analyze):
    # Mock temporary file
    mock_file = MagicMock()
    mock_file.__enter__.return_value.name = "/tmp/test.jpg"
    mock_temp_file.return_value = mock_file
    
    # Mock DeepFace.analyze
    mock_deepface_analyze.side_effect = [
        {"dominant_emotion": "happy"},
        {"dominant_emotion": "neutral"},
        {"dominant_emotion": "sad"}
    ]
    
    # Create test frames
    test_frames = [
        np.zeros((480, 640, 3), dtype=np.uint8),
        np.zeros((480, 640, 3), dtype=np.uint8),
        np.zeros((480, 640, 3), dtype=np.uint8)
    ]
    
    # Test the analyze_emotions function
    results = analyze_emotions(test_frames)
    
    # Verify results
    assert results["happy"] == 1
    assert results["neutral"] == 1
    assert results["sad"] == 1
    assert results["angry"] == 0