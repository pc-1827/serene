import cv2
import numpy as np
import logging
from typing import List, Dict
from deepface import DeepFace
import tempfile
import os

logger = logging.getLogger(__name__)

def process_video_frames(video_path: str, sample_rate: int = 10) -> List[np.ndarray]:
    """
    Extract frames from a video file at the specified sampling rate.
    Returns a list of numpy arrays representing frames.
    """
    frames = []
    
    try:
        # Open the video file
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            logger.error(f"Could not open video file: {video_path}")
            return frames
        
        frame_count = 0
        
        # Read frames
        while True:
            ret, frame = cap.read()
            
            if not ret:
                break
            
            # Sample frames at the given rate
            if frame_count % sample_rate == 0:
                frames.append(frame)
                
            frame_count += 1
        
        # Release the video capture object
        cap.release()
        
        logger.info(f"Extracted {len(frames)} frames from video (sampling every {sample_rate} frames)")
        return frames
    
    except Exception as e:
        logger.error(f"Error processing video frames: {str(e)}")
        return frames

def analyze_emotions(frames: List[np.ndarray]) -> Dict[str, int]:
    """
    Analyze emotions in a list of frames using DeepFace.
    Returns a dictionary of emotions and their count.
    """
    if not frames:
        logger.warning("No frames to analyze")
        return {}
    
    # Dictionary to store emotion counts
    emotion_counts = {
        "angry": 0,
        "disgust": 0,
        "fear": 0,
        "happy": 0,
        "sad": 0,
        "surprise": 0,
        "neutral": 0
    }
    
    processed_frames = 0
    
    # Process each frame
    for i, frame in enumerate(frames):
        try:
            # Save frame to a temporary file (DeepFace works better with files)
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
                temp_file_path = temp_file.name
                cv2.imwrite(temp_file_path, frame)
            
            # Analyze with DeepFace
            results = DeepFace.analyze(
                img_path=temp_file_path,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            # DeepFace may return a list or a single result
            if isinstance(results, list):
                result = results[0]
            else:
                result = results
            
            # Get dominant emotion
            dominant_emotion = result['dominant_emotion']
            emotion_counts[dominant_emotion] += 1
            processed_frames += 1
            
            # Clean up
            os.unlink(temp_file_path)
            
            # Log progress periodically
            if (i + 1) % 10 == 0:
                logger.info(f"Processed {i + 1}/{len(frames)} frames")
                
        except Exception as e:
            logger.error(f"Error analyzing frame {i}: {str(e)}")
            # Continue with next frame
    
    logger.info(f"Successfully analyzed {processed_frames}/{len(frames)} frames")
    logger.info(f"Emotion counts: {emotion_counts}")
    
    return emotion_counts