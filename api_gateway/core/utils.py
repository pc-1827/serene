import json
from fastapi import Request, Response
import httpx
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def proxy_request(request: Request, target_url: str, timeout: float = 10.0):
    """
    Generic proxy function that forwards requests to target services
    and returns their responses.
    """
    # Prepare request data
    method = request.method
    headers = dict(request.headers)
    body = await request.body()
    
    logger.info(f"Proxying {method} request to {target_url}")
    
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.request(
                method,
                target_url,
                headers={k: v for k, v in headers.items() if k.lower() != "host"},
                content=body,
                params=dict(request.query_params),
            )
        
        logger.info(f"Response from {target_url}: status={resp.status_code}")
        return Response(
            content=resp.content,
            status_code=resp.status_code,
            headers=dict(resp.headers),
            media_type=resp.headers.get("content-type")
        )
    except httpx.ReadTimeout:
        logger.error(f"Request to {target_url} timed out after {timeout}s")
        return Response(
            content=json.dumps({
                "error": "The request took too long to complete. Please try again later."
            }),
            status_code=504,  # Gateway Timeout
            media_type="application/json"
        )
    except Exception as e:
        logger.error(f"Error proxying request to {target_url}: {e}")
        return Response(
            content=json.dumps({"error": str(e)}),
            status_code=500,
            media_type="application/json"
        )