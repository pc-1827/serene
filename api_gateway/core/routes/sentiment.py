from fastapi import APIRouter, Request
from ..config import SENTIMENT_SERVICE_URL
from ..utils import proxy_request

router = APIRouter(prefix="/sentiment", tags=["sentiment"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_sentiment(request: Request, path: str):
    target_url = f"{SENTIMENT_SERVICE_URL}/sentiment/{path}"
    return await proxy_request(request, target_url)