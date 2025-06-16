from pydantic import BaseModel
from typing import Dict, List, Optional

class EmotionAnalysisResult(BaseModel):
    emotion: str
    count: int
    percentage: float

class VideoAnalysisRequest(BaseModel):
    user_id: int
    video_id: str
    frame_sample_rate: Optional[int] = 10

class VideoAnalysisResponse(BaseModel):
    user_id: int
    video_id: str
    message: str
    status: str