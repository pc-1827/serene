import uvicorn
from core.app import create_app
from core.routes import register_routes

# Create the FastAPI application
app = create_app()

# Register all routes
register_routes(app)

# For local development only
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)

# Old main.py code

# from fastapi import FastAPI, Request, Response
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# import httpx
# import os
# import json

# AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000")
# SENTIMENT_SERVICE_URL = os.getenv("SENTIMENT_SERVICE_URL", "http://sentiment-service:8002")
# CHATBOT_SERVICE_URL = os.getenv("CHATBOT_SERVICE_URL", "http://chatbot-service:8001")
# VOICE_SERVICE_URL = os.getenv("VOICE_SERVICE_URL", "http://voice_service:8003")
# VIDEO_SERVICE_URL = os.getenv("VIDEO_SERVICE_URL", "http://video_service:8004")

# app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # For development. In production, specify your frontend domain
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
# async def proxy_auth(request: Request, path: str):
#     # Build the proxied URL
#     url = f"{AUTH_SERVICE_URL}/auth/{path}"
#     # Prepare request data
#     method = request.method
#     headers = dict(request.headers)
#     body = await request.body()

#     print(f"Proxying request to {url} with method {method}")
#     print(f"Request body: {body}")

#     async with httpx.AsyncClient() as client:
#         resp = await client.request(
#             method,
#             url,
#             headers={k: v for k, v in headers.items() if k.lower() != "host"},
#             content=body,
#             params=dict(request.query_params),
#         )
    
#     print(f"Response status: {resp.status_code}")
#     return Response(
#         content=resp.content,
#         status_code=resp.status_code,
#         headers=dict(resp.headers),
#         media_type=resp.headers.get("content-type")
#     )

# @app.api_route("/sentiment/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
# async def proxy_sentiment(request: Request, path: str):
#     # Build the proxied URL
#     url = f"{SENTIMENT_SERVICE_URL}/sentiment/{path}"
#     # Prepare request data
#     method = request.method
#     headers = dict(request.headers)
#     body = await request.body()

#     print(f"Proxying sentiment request to {url} with method {method}")
#     print(f"Request body: {body}")

#     async with httpx.AsyncClient() as client:
#         resp = await client.request(
#             method,
#             url,
#             headers={k: v for k, v in headers.items() if k.lower() != "host"},
#             content=body,
#             params=dict(request.query_params),
#         )
    
#     print(f"Response status: {resp.status_code}")
#     return Response(
#         content=resp.content,
#         status_code=resp.status_code,
#         headers=dict(resp.headers),
#         media_type=resp.headers.get("content-type")
#     )

# @app.api_route("/chat/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
# async def proxy_chat(request: Request, path: str):
#     # Build the proxied URL
#     url = f"{CHATBOT_SERVICE_URL}/chat/{path}"
#     # Prepare request data
#     method = request.method
#     headers = dict(request.headers)
#     body = await request.body()

#     print(f"Proxying chat request to {url} with method {method}")
#     print(f"Request body: {body}")

#     # Increase timeout for chat requests, especially for search operations
#     async with httpx.AsyncClient(timeout=30.0) as client:  # 30 second timeout
#         try:
#             resp = await client.request(
#                 method,
#                 url,
#                 headers={k: v for k, v in headers.items() if k.lower() != "host"},
#                 content=body,
#                 params=dict(request.query_params),
#             )
            
#             print(f"Response status: {resp.status_code}")
#             return Response(
#                 content=resp.content,
#                 status_code=resp.status_code,
#                 headers=dict(resp.headers),
#                 media_type=resp.headers.get("content-type")
#             )
#         except httpx.ReadTimeout:
#             print("Request to chatbot service timed out")
#             # Return a graceful error response
#             return Response(
#                 content=json.dumps({
#                     "error": "The request took too long to complete. Please try again later."
#                 }),
#                 status_code=504,  # Gateway Timeout
#                 media_type="application/json"
#             )
#         except Exception as e:
#             print(f"Error proxying request: {e}")
#             return Response(
#                 content=json.dumps({"error": str(e)}),
#                 status_code=500,
#                 media_type="application/json"
#             )

# @app.api_route("/voice/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
# async def proxy_voice(request: Request, path: str):
#     # Build the proxied URL
#     url = f"{VOICE_SERVICE_URL}/voice/{path}"
#     # Prepare request data
#     method = request.method
#     headers = dict(request.headers)
#     body = await request.body()

#     print(f"Proxying voice request to {url} with method {method}")
    
#     # Use a longer timeout for voice processing
#     async with httpx.AsyncClient(timeout=60.0) as client:
#         try:
#             resp = await client.request(
#                 method,
#                 url,
#                 headers={k: v for k, v in headers.items() if k.lower() != "host"},
#                 content=body,
#                 params=dict(request.query_params),
#             )
            
#             print(f"Voice service response status: {resp.status_code}")
#             return Response(
#                 content=resp.content,
#                 status_code=resp.status_code,
#                 headers=dict(resp.headers),
#                 media_type=resp.headers.get("content-type")
#             )
#         except Exception as e:
#             print(f"Error proxying voice request: {e}")
#             return Response(
#                 content=json.dumps({"error": str(e)}),
#                 status_code=500,
#                 media_type="application/json"
#             )

# @app.api_route("/video/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
# async def proxy_video(request: Request, path: str):
#     # Build the proxied URL
#     url = f"{VIDEO_SERVICE_URL}/video/{path}"
#     # Prepare request data
#     method = request.method
#     headers = dict(request.headers)
#     body = await request.body()

#     print(f"Proxying video request to {url} with method {method}")
    
#     # Use a longer timeout for video processing
#     async with httpx.AsyncClient(timeout=300.0) as client:  # 5 minute timeout
#         try:
#             resp = await client.request(
#                 method,
#                 url,
#                 headers={k: v for k, v in headers.items() if k.lower() != "host"},
#                 content=body,
#                 params=dict(request.query_params),
#             )
            
#             print(f"Video service response status: {resp.status_code}")
#             return Response(
#                 content=resp.content,
#                 status_code=resp.status_code,
#                 headers=dict(resp.headers),
#                 media_type=resp.headers.get("content-type")
#             )
#         except Exception as e:
#             print(f"Error proxying video request: {e}")
#             return Response(
#                 content=json.dumps({"error": str(e)}),
#                 status_code=500,
#                 media_type="application/json"
#             )

# @app.get("/")
# def root():
#     return {"message": "API Gateway is running"}