import os
import tempfile
from typing import Optional, Tuple
import soundfile as sf

def normalize_audio(audio_path: str) -> Tuple[str, bool]:
    """
    Normalize audio file format if needed
    Returns the path to the normalized file and a flag indicating if a new file was created
    """
    try:
        # Check if format conversion or normalization is needed
        # For now, just return the original path
        return audio_path, False
    except Exception as e:
        print(f"Error normalizing audio: {e}")
        return audio_path, False