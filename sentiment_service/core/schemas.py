from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, date

class SentimentRequest(BaseModel):
    user_id: int
    days: Optional[int] = 30

class DailySentiment(BaseModel):
    date: date
    labels: Dict[str, float]

class SentimentResponse(BaseModel):
    user_id: int
    daily_sentiments: List[DailySentiment]
    available_labels: List[str]