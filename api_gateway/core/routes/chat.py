from fastapi import APIRouter, Request
from ..config import CHATBOT_SERVICE_URL, CHAT_TIMEOUT
from ..utils import proxy_request

router = APIRouter(prefix="/chat", tags=["chat"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_chat(request: Request, path: str):
    target_url = f"{CHATBOT_SERVICE_URL}/chat/{path}"
    return await proxy_request(request, target_url, timeout=CHAT_TIMEOUT)