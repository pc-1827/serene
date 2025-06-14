from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict
import time
import json

from .database import get_db, init_db
from .models import ChatMessage, SentimentScore, User, ChatSession
from .schemas import MessageRequest, MessageResponse, SentimentData
from .chatbot import get_sentiment_analysis, get_bot_response, user_chat_sessions, therapy_model, DR_SARAH_PROMPT

app = FastAPI()

# Initialize the database on startup
@app.on_event("startup")
async def startup_event():
    print("Initializing database...")
    init_db()
    print("Database initialized")

@app.get("/")
def read_root():
    return {"message": "Chatbot Service is running"}

# Add this function to initialize a chat session
@app.post("/chat/init-session/{user_id}")
def initialize_chat_session(user_id: int, db: Session = Depends(get_db)):
    """Initialize or reset a chat session with previous messages."""
    try:
        # Get the user's messages from the database
        messages = db.query(ChatMessage).filter(
            ChatMessage.user_id == user_id
        ).order_by(ChatMessage.created_at).all()
        
        # If the user already has a chat session, reset it
        if user_id in user_chat_sessions:
            del user_chat_sessions[user_id]
        
        # Create a new chat session
        chat = therapy_model.start_chat()
        
        # Initialize with system prompt
        chat.send_message(DR_SARAH_PROMPT)
        
        # Load previous messages into the chat
        for msg in messages[-10:]:  # Use the last 10 messages to avoid token limits
            try:
                if msg.is_bot:
                    # Skip bot messages in initialization as we don't want to feed our own responses back
                    continue
                else:
                    # Send user message
                    chat.send_message(msg.message_text)
            except Exception as e:
                print(f"Error adding message to chat: {e}")
        
        # Store the chat session
        user_chat_sessions[user_id] = chat
        
        return {"message": "Chat session initialized successfully"}
    except Exception as e:
        print(f"Error initializing chat session: {e}")
        raise HTTPException(status_code=500, detail=f"Error initializing chat session: {str(e)}")

# Add this function to handle chat sessions
def get_or_create_chat_session(db, user_id):
    """Get or create a chat session for a user."""
    session = db.query(ChatSession).filter(ChatSession.user_id == user_id).first()
    
    if not session:
        print(f"Creating new chat session for user {user_id}")
        session = ChatSession(
            user_id=user_id,
            session_data=json.dumps([])
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    
    return session

# Update your process_message function
@app.post("/chat/message", response_model=MessageResponse)
def process_message(request: MessageRequest, db: Session = Depends(get_db)):
    """Process a user message, store it and sentiment scores, and return a bot response."""
    try:
        print(f"Processing message for user ID: {request.user_id}")
        
        # Check if user exists, create if not
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            print(f"User {request.user_id} not found, creating placeholder record")
            user = User(id=request.user_id, email=f"user_{request.user_id}@placeholder.com")
            db.add(user)
            db.commit()
        
        # 1. Store the user message
        user_message = ChatMessage(
            user_id=request.user_id,
            is_bot=False,
            message_text=request.message,
            translated_text=request.message,
            language=request.language
        )
        db.add(user_message)
        db.commit()
        db.refresh(user_message)
        
        print(f"User message stored with ID: {user_message.id}")
        
        # 2. Get sentiment analysis
        sentiment_data = get_sentiment_analysis(request.message)
        
        # 3. Store sentiment scores
        sentiment_scores = []
        for label, score in sentiment_data.items():
            sentiment = SentimentScore(
                user_id=request.user_id,
                chat_message_id=user_message.id,
                score=score,
                label=label
            )
            db.add(sentiment)
            sentiment_scores.append(SentimentData(label=label, score=score))
        db.commit()
        
        print(f"Sentiment scores stored for message ID: {user_message.id}")
        
        # 4. Get or update chat session
        chat_session = get_or_create_chat_session(db, request.user_id)
        
        # 5. Get bot response with context from stored messages
        bot_response_text = get_bot_response(request.user_id, request.message)
        
        # 6. Store bot response
        bot_message = ChatMessage(
            user_id=request.user_id,
            is_bot=True,
            message_text=bot_response_text,
            translated_text=bot_response_text,
            language=request.language
        )
        db.add(bot_message)
        db.commit()
        db.refresh(bot_message)
        
        print(f"Bot response stored with ID: {bot_message.id}")
        
        # 7. Return response
        return MessageResponse(
            message_id=bot_message.id,
            bot_message=bot_response_text,
            sentiment_scores=sentiment_scores,
            created_at=datetime.now()
        )
        
    except Exception as e:
        print(f"Error processing message: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.get("/chat/history/{user_id}")
def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    """Get chat history for a user."""
    try:
        print(f"Fetching chat history for user ID: {user_id}")
        
        messages = db.query(ChatMessage).filter(
            ChatMessage.user_id == user_id
        ).order_by(ChatMessage.created_at).all()
        
        print(f"Found {len(messages)} messages for user ID: {user_id}")
        
        return [
            {
                "id": msg.id,
                "is_bot": msg.is_bot,
                "message": msg.message_text,
                "created_at": msg.created_at
            }
            for msg in messages
        ]
    except Exception as e:
        print(f"Error fetching chat history: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching chat history: {str(e)}")