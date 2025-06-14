from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import tempfile
import os
import logging
from typing import Annotated

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for your friend's UI domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://your-ui-domain.com"],  # Update with actual UI domain
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Load medium model for better accuracy (use 'medium' instead of 'base')
model = whisper.load_model("medium")

@app.post("/transcribe")
async def transcribe_audio(file: Annotated[UploadFile, File(..., description="Audio file from UI recording")]):
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.wav', '.mp3', '.m4a', '.webm')):
            raise HTTPException(400, "Unsupported file format. Use WAV, MP3, M4A, or WEBM")

        # Create temp file with original extension
        file_ext = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            content = await file.read()
            
            # Validate file size (10MB limit)
            if len(content) > 10 * 1024 * 1024:
                raise HTTPException(413, "File too large. Max 10MB allowed")
                
            tmp.write(content)
            tmp_path = tmp.name

        try:
            # Transcribe using Whisper
            logger.info(f"Processing file: {file.filename}")
            result = model.transcribe(tmp_path)
            transcription = result["text"].strip()
            
            return {
                "success": True,
                "text": transcription,
                "language": result.get("language", "en")  # Whisper auto-detects language
            }
            
        finally:
            # Cleanup temp file even if transcription fails
            os.remove(tmp_path)

    except HTTPException as he:
        logger.error(f"Client error: {he.detail}")
        raise
    except Exception as e:
        logger.error(f"Transcription failed: {str(e)}")
        raise HTTPException(500, "Audio processing error") from e
