import os
import time
import psycopg2
import re
from datetime import datetime
from googlesearch import search

# Attempt to import google.generativeai; fallback if unavailable
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    print("⚠️ google.generativeai module not found. LLM functionality will be disabled.")
    HAS_GENAI = False

API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyAB1H-HLUKL-5OAFfl_Y8OwHRdRAaZUrFs")
if HAS_GENAI:
    genai.configure(api_key=API_KEY)

# Database configuration - YOUR SPECIFIC CREDENTIALS
DB_CONFIG = {
    'host': 'localhost',
    'port': '5432',
    'user': 'postgres',
    'password': '12345',
    'database': 'wellness'
}

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

generation_config = {
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

if HAS_GENAI:
    therapy_model = genai.GenerativeModel(
        model_name='gemini-1.5-flash-latest',
        generation_config=generation_config,
        system_instruction=DR_SARAH_PROMPT
    )

    sentiment_model = genai.GenerativeModel(
        model_name='gemini-1.5-flash-latest',
        generation_config={
            "temperature": 0.1,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 1024,
        },
        system_instruction=SENTIMENT_ANALYSIS_PROMPT
    )

# --------------------------------
# Web Search Function
# --------------------------------
def get_web_results(query, num_results=3):
    try:
        print(f"\U0001F310 Searching web for: {query}")
        results = list(search(query, num_results=num_results))
        return results
    except Exception as e:
        print(f"❌ Web search failed: {e}")
        return []

class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.connect()

    def connect(self):
        try:
            self.connection = psycopg2.connect(**DB_CONFIG)
            print("✅ Connected to PostgreSQL database 'wellness' on localhost:5432")
        except Exception as e:
            print(f"❌ Error connecting to database: {e}")
            self.connection = None

    def insert_chat_message(self, user_id, message_text, is_bot=False, language='en'):
        if not self.connection:
            return None
        try:
            cursor = self.connection.cursor()
            insert_query = """
                INSERT INTO chat_messages (user_id, is_bot, message_text, language, created_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
            """
            cursor.execute(insert_query, (
                int(user_id), bool(is_bot), str(message_text), str(language), datetime.now()
            ))
            message_id = cursor.fetchone()[0]
            self.connection.commit()
            cursor.close()
            print(f"💾 Message stored: ID={message_id}, is_bot={is_bot}")
            return message_id
        except Exception as e:
            print(f"❌ Error inserting chat message: {e}")
            self.connection.rollback()
            return None

    def insert_sentiment_scores(self, user_id, chat_message_id, sentiment_data):
        if not self.connection:
            return False
        try:
            cursor = self.connection.cursor()
            insert_query = """
                INSERT INTO sentiment_scores (user_id, chat_message_id, score, label, recorded_at)
                VALUES (%s, %s, %s, %s, %s);
            """
            for emotion_label, emotion_score in sentiment_data.items():
                cursor.execute(insert_query, (
                    int(user_id), int(chat_message_id), float(emotion_score), str(emotion_label), datetime.now()
                ))
            self.connection.commit()
            cursor.close()
            print(f"📊 Sentiment scores stored: {len(sentiment_data)} emotions for message {chat_message_id}")
            return True
        except Exception as e:
            print(f"❌ Error inserting sentiment scores: {e}")
            self.connection.rollback()
            return False

    def close(self):
        if self.connection:
            self.connection.close()
            print("🔌 Database connection closed")

def parse_sentiment_response(sentiment_text):
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
                    sentiment_data[emotion] = max(0.0, min(10.0, parsed))
            except Exception as e:
                print(f"⚠️ Parsing error on line '{line}': {e}")
    return sentiment_data

def analyze_message_sentiment(message):
    if not HAS_GENAI:
        print("❌ Sentiment analysis not available without google.generativeai")
        return {}
    try:
        print("🧠 Analyzing sentiment...")
        response = sentiment_model.generate_content(f"Analyze this message: {message}")
        return parse_sentiment_response(response.text)
    except Exception as e:
        print(f"❌ Sentiment analysis error: {e}")
        return {}

def run_therapist_chatbot():
    print("🧠 Welcome to the Serene Chatbot.")
    print("You are now speaking with Dr. Sarah, your AI therapeutic assistant.")
    print("Type 'exit' anytime to end the session.\n")

    db = DatabaseManager()
    if not db.connection:
        print("❌ Cannot proceed without database connection")
        return

    user_id = 1  # Demo only
    chat_session = None
    if HAS_GENAI:
        chat_session = therapy_model.start_chat(history=[])

    while True:
        user_input = input("You: ").strip()

        if user_input.lower() == 'exit':
            print("\nDr. Sarah: It was good talking with you today. Remember to be kind to yourself. Goodbye.")
            break

        if not user_input:
            continue

        print("💾 Storing user message...")
        user_message_id = db.insert_chat_message(user_id, user_input, is_bot=False, language='en')

        if user_message_id:
            sentiment_data = analyze_message_sentiment(user_input)
            if sentiment_data:
                db.insert_sentiment_scores(user_id, user_message_id, sentiment_data)
                top_emotions = sorted(sentiment_data.items(), key=lambda x: x[1], reverse=True)[:3]
                print("🎭 Top emotions:", ', '.join([f"{k}:{v}" for k,v in top_emotions]))

        # Optional web search
        if any(word in user_input.lower() for word in ["tips", "search", "find", "recommend", "resources"]):
            links = get_web_results(user_input)
            if links:
                print("🔎 You might also find these resources helpful:")
                for i, link in enumerate(links, 1):
                    print(f"  {i}. {link}")
            else:
                print("🌐 No helpful links found.")

        if HAS_GENAI:
            try:
                print("\nDr. Sarah is typing...")
                response = chat_session.send_message(user_input)
                time.sleep(1)
                print("Dr. Sarah:", response.text, "\n")

                db.insert_chat_message(user_id, response.text, is_bot=True, language='en')

            except Exception as e:
                print(f"\n❌ Bot error: {e}\n")
        else:
            print("🤖 Gemini AI not available. Please install 'google.generativeai' to enable chatbot features.")

    db.close()

if __name__ == "__main__":
    run_therapist_chatbot()
