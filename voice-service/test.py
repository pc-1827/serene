import requests

try:
    # Verify file path
    print("Attempting to open audio file...")
    with open("harvard.wav", "rb") as f:
        files = {"file": f}
        
        # Send request
        print("Sending request to server...")
        response = requests.post(
            "http://localhost:8000/transcribe",
            files=files
        )
        
        # Show full response
        print(f"Status Code: {response.status_code}")
        print("Response Content:", response.text)

except Exception as e:
    print(f"Error: {str(e)}")
