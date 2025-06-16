import pytest
from unittest.mock import patch, MagicMock
import os

from core.utils import normalize_audio

def test_normalize_audio(tmp_path):
    # Create a test file
    test_file = tmp_path / "test.wav"
    test_file.write_text("dummy content")
    
    # Test the normalize_audio function
    path, created = normalize_audio(str(test_file))
    
    # Verify results
    assert path == str(test_file)
    assert created is False