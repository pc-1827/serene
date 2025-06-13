from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    user_id: str
    message: str
    include_context: Optional[bool] = False

class Resource(BaseModel):
    title: str
    text: str
    url: Optional[str] = None

class SentimentAnalysis(BaseModel):
    compound: float
    positive: float
    negative: float
    neutral: float
    emotional_state: str

class ChatResponse(BaseModel):
    sentiment_analysis: SentimentAnalysis
    recommended_resources: List[Resource]
    user_history: Optional[List[str]] = None
    crisis_alert: Optional[bool] = False
