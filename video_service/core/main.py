import os
import tempfile
import uuid
import cv2
import numpy as np
from typing import Dict, List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from pydantic import BaseModel
import httpx
import logging
from .utils import process_video_frames, analyze_emotions
from .schemas import EmotionAnalysisResult, VideoAnalysisRequest, VideoAnalysisResponse

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Environment variables
SENTIMENT_SERVICE_URL = os.getenv("SENTIMENT_SERVICE_URL", "http://sentiment-service:8002")

@app.get("/")
def read_root():
    return {"message": "Video Emotion Analysis Service is running"}

@app.post("/video/analyze", response_model=VideoAnalysisResponse)
async def analyze_video(
    background_tasks: BackgroundTasks,
    user_id: int,
    file: UploadFile = File(...),
    frame_sample_rate: int = 10  # Process every Nth frame
):
    """
    Analyze emotions in a video file and send results to sentiment service.
    The analysis runs in the background while immediately returning a response.
    """
    if not file.filename or not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload MP4, AVI, MOV, or MKV.")
    
    try:
        # Generate a unique ID for this video analysis
        video_id = str(uuid.uuid4())
        
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file_path = temp_file.name
            content = await file.read()
            temp_file.write(content)
        
        logger.info(f"Video saved to temporary file: {temp_file_path}")
        
        # Schedule the video processing in the background
        background_tasks.add_task(
            process_video_in_background,
            temp_file_path,
            user_id,
            video_id,
            frame_sample_rate
        )
        
        return VideoAnalysisResponse(
            user_id=user_id,
            video_id=video_id,
            message="Video processing started. Results will be available in the sentiment report.",
            status="processing"
        )
        
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

async def process_video_in_background(
    video_path: str,
    user_id: int,
    video_id: str,
    frame_sample_rate: int
):
    """Process video frames and send emotion data to sentiment service"""
    try:
        # Extract frames and analyze emotions
        frames = process_video_frames(video_path, frame_sample_rate)
        emotion_results = analyze_emotions(frames)
        
        logger.info(f"Analyzed {len(frames)} frames from video ID {video_id}")
        logger.info(f"Emotion results: {emotion_results}")
        
        # Send results to sentiment service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SENTIMENT_SERVICE_URL}/sentiment/video",
                json={
                    "user_id": user_id,
                    "video_id": video_id,
                    "emotions": emotion_results
                }
            )
            
            # Check if the request was successful
            if response.status_code != 200:
                logger.error(f"Error sending data to sentiment service: {response.text}")
            else:
                logger.info(f"Emotion data sent to sentiment service successfully")
    
    except Exception as e:
        logger.error(f"Error in background processing: {str(e)}")
    
    finally:
        # Clean up the temporary file
        try:
            os.unlink(video_path)
            logger.info(f"Temporary video file removed: {video_path}")
        except Exception as e:
            logger.error(f"Error removing temporary file: {str(e)}")