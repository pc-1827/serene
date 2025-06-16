from fastapi import APIRouter, Request
from ..config import VOICE_SERVICE_URL, VOICE_TIMEOUT
from ..utils import proxy_request

router = APIRouter(prefix="/voice", tags=["voice"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_voice(request: Request, path: str):
    target_url = f"{VOICE_SERVICE_URL}/voice/{path}"
    return await proxy_request(request, target_url, timeout=VOICE_TIMEOUT)