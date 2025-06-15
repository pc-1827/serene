import os
import tempfile
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import httpx
from faster_whisper import WhisperModel
import soundfile as sf

# Initialize FastAPI app
app = FastAPI()

# Environment variables
CHATBOT_SERVICE_URL = os.getenv("CHATBOT_SERVICE_URL", "http://chatbot-service:8001")

# Initialize the Whisper model (small model for faster inference and less memory usage)
# The model will be downloaded on first use
try:
    model = WhisperModel("small", device="cpu", compute_type="int8")
    print("Whisper model initialized successfully")
except Exception as e:
    print(f"Error initializing Whisper model: {e}")
    model = None

class TranscriptionResponse(BaseModel):
    text: str
    language: Optional[str] = "en"

@app.get("/")
def read_root():
    return {"message": "Voice Service is running"}

@app.post("/voice/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe uploaded audio file to text using Whisper"""
    if model is None:
        raise HTTPException(status_code=500, detail="Whisper model not initialized")
    
    try:
        print(f"Received audio file: {file.filename}")
        
        # Save the uploaded file to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file_path = temp_file.name
            content = await file.read()
            temp_file.write(content)
        
        print(f"Saved audio to temporary file: {temp_file_path}")
        
        # Transcribe the audio
        print("Starting transcription...")
        segments, info = model.transcribe(temp_file_path, beam_size=5)
        
        # Get the transcribed text
        transcription = " ".join([segment.text for segment in segments])
        language = info.language
        
        print(f"Transcription complete: '{transcription}' (Language: {language})")
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        return TranscriptionResponse(text=transcription, language=language)
    
    except Exception as e:
        print(f"Error during transcription: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")

@app.post("/voice/chat/{user_id}")
async def process_voice_message(user_id: int, file: UploadFile = File(...)):
    """Process voice message - transcribe and send to chatbot service"""
    try:
        # Step 1: Transcribe the audio
        transcription_response = await transcribe_audio(file)
        transcribed_text = transcription_response.text
        
        print(f"Transcribed text: {transcribed_text}")
        
        # Step 2: Send the transcribed text to chatbot service
        async with httpx.AsyncClient() as client:
            chatbot_response = await client.post(
                f"{CHATBOT_SERVICE_URL}/chat/message",
                json={
                    "user_id": user_id,
                    "message": transcribed_text,
                    "language": transcription_response.language or "en"
                }
            )
            
            # Check if the request was successful
            if chatbot_response.status_code != 200:
                raise HTTPException(status_code=chatbot_response.status_code, detail="Error from chatbot service")
            
            # Get the chatbot response data
            chatbot_data = chatbot_response.json()
            
            # Add the transcribed text to the response
            chatbot_data["transcribed_text"] = transcribed_text
            
            return chatbot_data
    
    except Exception as e:
        print(f"Error processing voice message: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing voice message: {str(e)}")