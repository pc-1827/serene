import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY", "")
print(f"API KEY found: {'Yes' if api_key else 'No'}")
print(f"API KEY first 5 chars: {api_key[:5] if api_key else 'None'}")
print(f"All environment variables: {os.environ}")