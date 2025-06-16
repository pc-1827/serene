from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, date

class SentimentRequest(BaseModel):
    user_id: int
    days: Optional[int] = 30

class DailySentiment(BaseModel):
    date: date
    labels: Dict[str, float]

class VideoEmotionData(BaseModel):
    user_id: int
    video_id: str
    emotions: Dict[str, int]

class VideoSentimentResponse(BaseModel):
    user_id: int
    video_id: str
    message: str

class SentimentResponse(BaseModel):
    user_id: int
    daily_sentiments: List[DailySentiment]
    available_labels: List[str]
    video_emotions: Optional[Dict[str, float]] = None

class ChatSentimentData(BaseModel):
    user_id: int
    chat_message_id: int
    sentiments: Dict[str, float]
    language: Optional[str] = "en"