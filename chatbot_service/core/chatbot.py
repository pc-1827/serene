import os
import re
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv(verbose=True)
API_KEY = os.getenv("GOOGLE_API_KEY", "")
SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY", "")
SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")
print(f"API KEY found: {'Yes' if API_KEY else 'No'}")
print(f"SEARCH API KEY found: {'Yes' if SEARCH_API_KEY else 'No'}")
print(f"SEARCH ENGINE ID found: {'Yes' if SEARCH_ENGINE_ID else 'No'}")

# Attempt to import google.generativeai; fallback if unavailable
try:
    import google.generativeai as genai
    HAS_GENAI = True
    print("Successfully imported google.generativeai")
except ImportError:
    print("Warning: google.generativeai module not found. LLM functionality will be disabled.")
    HAS_GENAI = False

# Attempt to import Google API client; fallback if unavailable
try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    HAS_GOOGLE_API = True
    print("Successfully imported Google API client")
except ImportError:
    print("Warning: Google API client not found. Official search API will be disabled.")
    HAS_GOOGLE_API = False

# Configure genai if API key is available
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

8. **Resource Sharing:** When users ask for resources, information, or articles, respond positively. You can say things like "I'd be happy to suggest some resources on that topic" or "Let me provide you with some helpful information on that." DO NOT say that you can't search the internet or access outside information. The system will automatically append relevant resources to your response when appropriate.
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
    print("Setting up Gemini models")
    # For older versions of the API, we'll handle the history ourselves
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

import concurrent.futures
import time

def get_web_results(query, num_results=3):
    """Search the web for relevant resources using Google's Custom Search API."""
    # Check if official API is available
    if HAS_GOOGLE_API and SEARCH_API_KEY and SEARCH_ENGINE_ID:
        try:
            print(f"Searching web using Google API for: {query}")
            
            # Create service object for Google Custom Search API
            service = build("customsearch", "v1", developerKey=SEARCH_API_KEY)
            
            # Add specific health-related terms to focus the search
            if "depression" in query.lower() or "anxiety" in query.lower() or "mental health" in query.lower():
                search_query = f"{query} medical resource"
            else:
                search_query = query
                
            # Execute the search with a timeout using concurrent.futures
            def execute_search():
                try:
                    result = service.cse().list(q=search_query, cx=SEARCH_ENGINE_ID, num=num_results).execute()
                    return result
                except Exception as e:
                    print(f"Error in execute_search: {e}")
                    return None
            
            # Use concurrent.futures to implement timeout
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(execute_search)
                try:
                    result = future.result(timeout=15)  # 15 second timeout
                    
                    if result and "items" in result:
                        urls = [item["link"] for item in result["items"]]
                        print(f"Found {len(urls)} results using Google API")
                        return urls
                    else:
                        print("No results found using Google API")
                except concurrent.futures.TimeoutError:
                    print("Search operation timed out")
                    future.cancel()
                    raise TimeoutError("Search operation timed out")
        except HttpError as e:
            print(f"Google API search error: {e}")
        except Exception as e:
            print(f"Error using Google API search: {e}")
    else:
        if not HAS_GOOGLE_API:
            print("Google API client not available")
        if not SEARCH_API_KEY:
            print("Search API key not available")
        if not SEARCH_ENGINE_ID:
            print("Search Engine ID not available")
    
    # Fall back to default resources based on query content
    print("Using default resources instead of search")
    if "postpartum depression" in query.lower():
        return [
            "https://www.nimh.nih.gov/health/publications/postpartum-depression",
            "https://www.postpartum.net/",
            "https://www.mayoclinic.org/diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617"
        ]
    elif "depression" in query.lower():
        return [
            "https://www.nimh.nih.gov/health/topics/depression",
            "https://www.psychiatry.org/patients-families/depression",
            "https://www.helpguide.org/articles/depression/depression-symptoms-and-warning-signs.htm"
        ]
    elif "anxiety" in query.lower():
        return [
            "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
            "https://adaa.org/understanding-anxiety",
            "https://www.psychiatry.org/patients-families/anxiety-disorders"
        ]
    else:
        return [
            "https://www.nimh.nih.gov/health",
            "https://www.samhsa.gov/find-help/national-helpline",
            "https://www.psychiatry.org/patients-families"
        ]

# Update the get_bot_response function to better maintain context
def get_bot_response(user_id, message):
    """Get a response from the chatbot for a user message."""
    if not HAS_GENAI or not API_KEY or not therapy_model:
        print("Chatbot response not available")
        return "I'm sorry, I'm not able to respond right now. Please try again later."
    
    try:
        # Check if the message might benefit from web search
        search_keywords = ["resources", "information", "help", "find", "search", "link", "website", "article"]
        should_search = any(keyword in message.lower() for keyword in search_keywords)
        
        search_results = []
        
        if should_search:
            try:
                print("Attempting web search...")
                search_results = get_web_results(message)
            except Exception as e:
                print(f"Error during search: {e}")
                # Continue without search results if there's an error
        
        # Create or get a chat session for this user
        if user_id not in user_chat_sessions:
            print(f"Creating new chat session for user {user_id}")
            chat = therapy_model.start_chat()
            # Initialize with system prompt
            chat.send_message(DR_SARAH_PROMPT)
            user_chat_sessions[user_id] = chat
        
        chat_session = user_chat_sessions[user_id]
        
        # If we're going to search, add instructions to the user's message
        actual_message = message
        if should_search:
            # Add a note to the message to influence the model's response
            actual_message = f"{message}\n\n[Note: I will provide relevant resources to the user after your response, so please acknowledge that you can help with finding resources but don't list specific websites in your response.]"
        
        # Send the user message with potential instructions
        print(f"Sending message to model: {actual_message}")
        response = chat_session.send_message(actual_message)
        response_text = response.text
        
        # If we have search results, append them to the response
        if search_results:
            # Check if the response contains phrases about not being able to search
            negative_phrases = ["I cannot search", "I can't search", "unable to search", 
                               "don't have the ability to search", "cannot browse", "can't browse",
                               "don't have access to", "I don't have internet"]
            
            if any(phrase in response_text.lower() for phrase in negative_phrases):
                # Replace the negative statement with a positive one
                response_text = "I'd be happy to help you find some resources on that topic. Here's some information that might be helpful:\n\n" + response_text.split(".", 1)[1].strip() if "." in response_text else response_text
            
            # Add the search results with a clear visual separator
            response_text += "\n\n---\n\n**RESOURCES**\n\nHere are some helpful resources I found for you:\n"
            for i, url in enumerate(search_results, 1):
                response_text += f"{i}. {url}\n"
            
        return response_text
            
    except Exception as e:
        print(f"Chatbot error: {e}")
        return "I'm sorry, I encountered an error. Please try again."