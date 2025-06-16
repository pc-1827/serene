from fastapi import APIRouter, Request
from ..config import VIDEO_SERVICE_URL, VIDEO_TIMEOUT
from ..utils import proxy_request

router = APIRouter(prefix="/video", tags=["video"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_video(request: Request, path: str):
    target_url = f"{VIDEO_SERVICE_URL}/video/{path}"
    return await proxy_request(request, target_url, timeout=VIDEO_TIMEOUT)