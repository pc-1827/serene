from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import json

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000")
SENTIMENT_SERVICE_URL = os.getenv("SENTIMENT_SERVICE_URL", "http://sentiment-service:8002")
CHATBOT_SERVICE_URL = os.getenv("CHATBOT_SERVICE_URL", "http://chatbot-service:8001")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_auth(request: Request, path: str):
    # Build the proxied URL
    url = f"{AUTH_SERVICE_URL}/auth/{path}"
    # Prepare request data
    method = request.method
    headers = dict(request.headers)
    body = await request.body()

    print(f"Proxying request to {url} with method {method}")
    print(f"Request body: {body}")

    async with httpx.AsyncClient() as client:
        resp = await client.request(
            method,
            url,
            headers={k: v for k, v in headers.items() if k.lower() != "host"},
            content=body,
            params=dict(request.query_params),
        )
    
    print(f"Response status: {resp.status_code}")
    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=dict(resp.headers),
        media_type=resp.headers.get("content-type")
    )

@app.api_route("/sentiment/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_sentiment(request: Request, path: str):
    # Build the proxied URL
    url = f"{SENTIMENT_SERVICE_URL}/sentiment/{path}"
    # Prepare request data
    method = request.method
    headers = dict(request.headers)
    body = await request.body()

    print(f"Proxying sentiment request to {url} with method {method}")
    print(f"Request body: {body}")

    async with httpx.AsyncClient() as client:
        resp = await client.request(
            method,
            url,
            headers={k: v for k, v in headers.items() if k.lower() != "host"},
            content=body,
            params=dict(request.query_params),
        )
    
    print(f"Response status: {resp.status_code}")
    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=dict(resp.headers),
        media_type=resp.headers.get("content-type")
    )

@app.api_route("/chat/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_chat(request: Request, path: str):
    # Build the proxied URL
    url = f"{CHATBOT_SERVICE_URL}/chat/{path}"
    # Prepare request data
    method = request.method
    headers = dict(request.headers)
    body = await request.body()

    print(f"Proxying chat request to {url} with method {method}")
    print(f"Request body: {body}")

    # Increase timeout for chat requests, especially for search operations
    async with httpx.AsyncClient(timeout=30.0) as client:  # 30 second timeout
        try:
            resp = await client.request(
                method,
                url,
                headers={k: v for k, v in headers.items() if k.lower() != "host"},
                content=body,
                params=dict(request.query_params),
            )
            
            print(f"Response status: {resp.status_code}")
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=dict(resp.headers),
                media_type=resp.headers.get("content-type")
            )
        except httpx.ReadTimeout:
            print("Request to chatbot service timed out")
            # Return a graceful error response
            return Response(
                content=json.dumps({
                    "error": "The request took too long to complete. Please try again later."
                }),
                status_code=504,  # Gateway Timeout
                media_type="application/json"
            )
        except Exception as e:
            print(f"Error proxying request: {e}")
            return Response(
                content=json.dumps({"error": str(e)}),
                status_code=500,
                media_type="application/json"
            )

@app.get("/")
def root():
    return {"message": "API Gateway is running"}