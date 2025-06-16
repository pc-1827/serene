import os

# Service URLs
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000")
SENTIMENT_SERVICE_URL = os.getenv("SENTIMENT_SERVICE_URL", "http://sentiment-service:8002")
CHATBOT_SERVICE_URL = os.getenv("CHATBOT_SERVICE_URL", "http://chatbot-service:8001")
VOICE_SERVICE_URL = os.getenv("VOICE_SERVICE_URL", "http://voice_service:8003")
VIDEO_SERVICE_URL = os.getenv("VIDEO_SERVICE_URL", "http://video_service:8004")

# Timeouts in seconds
DEFAULT_TIMEOUT = 10.0
CHAT_TIMEOUT = 30.0
VOICE_TIMEOUT = 60.0
VIDEO_TIMEOUT = 300.0  # 5 minutes