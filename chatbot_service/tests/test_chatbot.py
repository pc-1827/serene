import pytest
from unittest.mock import patch, MagicMock
import os

from core.chatbot import parse_sentiment_response, get_sentiment_analysis

def test_parse_sentiment_response():
    # Test parsing sentiment response
    test_input = """
    Happy: 4
    Sad: 3
    Depressed: 2
    Anxious: 6
    Angry: 1
    Hopeful: 5
    """
    
    result = parse_sentiment_response(test_input)
    
    assert "Happy" in result
    assert result["Happy"] == 0.4
    assert "Sad" in result
    assert result["Sad"] == 0.3
    assert "Angry" in result
    assert result["Angry"] == 0.1

@patch("core.chatbot.sentiment_model")
def test_get_sentiment_analysis(mock_sentiment_model):
    # Setup mock response
    mock_response = MagicMock()
    mock_response.text = """
    Happy: 4
    Sad: 3
    Depressed: 2
    Anxious: 6
    Angry: 1
    Hopeful: 5
    Frustrated: 4
    Calm: 3
    Stressed: 6
    Crisis/Suicidal: 0
    Lonely: 4
    Confident: 3
    Fearful: 5
    Grateful: 4
    Overwhelmed: 5
    """
    
    # Configure the mock sentiment model
    mock_sentiment_model.generate_content.return_value = mock_response
    
    # Set API key for testing
    os.environ["GOOGLE_API_KEY"] = "test_api_key"
    
    # Call the function
    result = get_sentiment_analysis("I'm feeling a bit down today")
    
    # Verify results
    assert isinstance(result, dict)
    assert "Happy" in result
    assert "Sad" in result
    assert "Anxious" in result
    assert result["Happy"] == 0.4
    assert result["Sad"] == 0.3
    assert result["Anxious"] == 0.6