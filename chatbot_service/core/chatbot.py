import os
import re
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv(verbose=True)
API_KEY = os.getenv("GOOGLE_API_KEY", "")
print(f"API KEY found: {'Yes' if API_KEY else 'No'}")

# Attempt to import google.generativeai; fallback if unavailable
try:
    import google.generativeai as genai
    HAS_GENAI = True
    print("Successfully imported google.generativeai")
except ImportError:
    print("Warning: google.generativeai module not found. LLM functionality will be disabled.")
    HAS_GENAI = False

if HAS_GENAI and API_KEY:
    print(f"Configuring genai with API key")
    genai.configure(api_key=API_KEY)
else:
    print(f"Warning: {'No API key found' if not API_KEY else ''} {'generativeai not available' if not HAS_GENAI else ''}")
    print(f"Chatbot functionality will be limited.")

DR_SARAH_PROMPT = """
You are Dr. Sarah, a compassionate and experienced licensed therapist specializing in Cognitive Behavioral Therapy (CBT). Your primary goal is to provide a safe, empathetic, and supportive space for users to explore their feelings related to anxiety, depression, and stress.

Your Core Directives:

1. **Empathy First:** Always start by acknowledging and validating the user's feelings. Use phrases like "I hear you," "That sounds incredibly difficult," or "Thank you for sharing that with me."

2. **Active Listening:** Ask open-ended, reflective questions to encourage the user to elaborate. Examples: "How did that make you feel?", "What was going through your mind at that moment?", "Can you tell me more about that experience?"

3. **Maintain Persona:** Consistently respond as Dr. Sarah. Be warm, non-judgmental, patient, and professional.

4. **Safety First (Crucial):** If the user expresses any intention of self-harm, suicide, or harm to others, you MUST immediately stop the therapeutic role and provide crisis resources. Respond with: "It sounds like you are in a great deal of pain, and it's very brave of you to talk about it. Because your safety is the most important thing, I need to urge you to contact a crisis hotline immediately. You can call or text 988 in the US and Canada, or find a local helpline. Please reach out to them right now." Do not deviate from this script.

5. **No Medical Advice:** You are a supportive AI, not a human doctor. Do not diagnose conditions or prescribe medication. Remind the user of this if they ask. Use phrases like, "While I can help you explore these feelings, it's important to consult with a medical doctor for diagnosis and treatment options."

6. **Use CBT Techniques:** Gently guide the user to identify thought patterns. You can ask, "When you feel that way, what is the first thought that comes to mind?" or "Let's try to challenge that thought. Is there another way to look at this situation?"

7. **Offer Coping Strategies:** Suggest simple, actionable techniques like deep breathing, the 5-4-3-2-1 grounding exercise, or journaling.
"""

SENTIMENT_ANALYSIS_PROMPT = """
You are an expert mental health sentiment analyzer. Analyze the following user message and provide detailed emotional sentiment scores.

For the user message, provide scores from 0-10 for these emotional states:
- Happy
- Sad
- Depressed
- Anxious
- Angry
- Hopeful
- Frustrated
- Calm
- Stressed
- Crisis/Suicidal
- Lonely
- Confident
- Fearful
- Grateful
- Overwhelmed

Format your response EXACTLY like this:

Happy: [score]
Sad: [score]
Depressed: [score]
Anxious: [score]
Angry: [score]
Hopeful: [score]
Frustrated: [score]
Calm: [score]
Stressed: [score]
Crisis/Suicidal: [score]
Lonely: [score]
Confident: [score]
Fearful: [score]
Grateful: [score]
Overwhelmed: [score]

Only provide the scores in this exact format. Be precise and clinical in your analysis.
"""

# Chat model configuration
generation_config = {
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

# Initialize models if available
therapy_model = None
sentiment_model = None

if HAS_GENAI and API_KEY:
    # Version 0.3.1 doesn't support system_instruction parameter directly
    # Create the models without system prompts
    therapy_model = genai.GenerativeModel(
        model_name='gemini-1.5-flash-latest',
        generation_config=generation_config
    )

    sentiment_model = genai.GenerativeModel(
        model_name='gemini-1.5-flash-latest',
        generation_config={
            "temperature": 0.1,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 1024,
        }
    )

# User chat sessions cache
user_chat_sessions = {}

def parse_sentiment_response(sentiment_text):
    """Parse the sentiment analysis response into a dictionary of emotion scores."""
    sentiment_data = {}
    lines = sentiment_text.strip().split('\n')
    for line in lines:
        if ':' in line:
            try:
                emotion, score = line.split(':', 1)
                emotion = emotion.strip()
                score = re.search(r'\d+(?:\.\d+)?', score.strip())
                if score:
                    parsed = float(score.group())
                    sentiment_data[emotion] = max(0.0, min(10.0, parsed)) / 10.0  # Normalize to 0-1
            except Exception as e:
                print(f"Parsing error on line '{line}': {e}")
    return sentiment_data

def get_sentiment_analysis(message):
    """Analyze the sentiment of a user message."""
    if not HAS_GENAI or not API_KEY or not sentiment_model:
        print("Sentiment analysis not available")
        # Return default values for testing
        return {
            "Happy": 0.4, "Sad": 0.3, "Depressed": 0.2, "Anxious": 0.6, 
            "Angry": 0.1, "Hopeful": 0.5, "Frustrated": 0.4, "Calm": 0.3,
            "Stressed": 0.6, "Crisis/Suicidal": 0.0, "Lonely": 0.4, 
            "Confident": 0.3, "Fearful": 0.5, "Grateful": 0.4, "Overwhelmed": 0.5
        }
    
    try:
        # Include the sentiment prompt in the message
        full_prompt = f"{SENTIMENT_ANALYSIS_PROMPT}\n\nAnalyze this message: {message}"
        response = sentiment_model.generate_content(full_prompt)
        return parse_sentiment_response(response.text)
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        # Return default values on error
        return {
            "Happy": 0.4, "Sad": 0.3, "Depressed": 0.2, "Anxious": 0.6, 
            "Angry": 0.1, "Hopeful": 0.5, "Frustrated": 0.4, "Calm": 0.3,
            "Stressed": 0.6, "Crisis/Suicidal": 0.0, "Lonely": 0.4, 
            "Confident": 0.3, "Fearful": 0.5, "Grateful": 0.4, "Overwhelmed": 0.5
        }

def get_bot_response(user_id, message):
    """Get a response from the chatbot for a user message."""
    if not HAS_GENAI or not API_KEY or not therapy_model:
        print("Chatbot response not available")
        return "I'm sorry, I'm not able to respond right now. Please try again later."
    
    try:
        # For older versions, we need to include the system prompt in the content
        full_prompt = f"{DR_SARAH_PROMPT}\n\nUser: {message}\nDr. Sarah:"
        
        # Create or get a chat session for this user
        if user_id not in user_chat_sessions:
            # In version 0.3.1, we can't set history in start_chat
            user_chat_sessions[user_id] = therapy_model.start_chat()
        
        chat_session = user_chat_sessions[user_id]
        
        # Send the message with the system prompt included
        response = chat_session.send_message(full_prompt)
        return response.text
    except Exception as e:
        print(f"Chatbot error: {e}")
        return "I'm sorry, I encountered an error. Please try again."