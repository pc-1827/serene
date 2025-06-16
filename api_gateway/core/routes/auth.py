from fastapi import APIRouter, Request
from ..config import AUTH_SERVICE_URL
from ..utils import proxy_request

router = APIRouter(prefix="/auth", tags=["auth"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_auth(request: Request, path: str):
    target_url = f"{AUTH_SERVICE_URL}/auth/{path}"
    return await proxy_request(request, target_url)