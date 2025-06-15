from typing import Optional
from pydantic import BaseModel

class TranscriptionResponse(BaseModel):
    text: str
    language: Optional[str] = "en"