from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class MessageRequest(BaseModel):
    user_id: int
    message: str
    language: Optional[str] = "en"

class SentimentData(BaseModel):
    label: str
    score: float

class MessageResponse(BaseModel):
    message_id: int
    bot_message: str
    sentiment_scores: List[SentimentData]
    created_at: datetime