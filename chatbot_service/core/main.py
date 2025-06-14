from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict
import time

from .database import get_db
from .models import ChatMessage, SentimentScore, User
from .schemas import MessageRequest, MessageResponse, SentimentData
from .chatbot import get_sentiment_analysis, get_bot_response

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Chatbot Service is running"}

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
            translated_text=request.message,  # Add translation if needed
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
        
        # 4. Get bot response
        bot_response_text = get_bot_response(request.user_id, request.message)
        
        # 5. Store bot response
        bot_message = ChatMessage(
            user_id=request.user_id,
            is_bot=True,
            message_text=bot_response_text,
            translated_text=bot_response_text,  # Add translation if needed
            language=request.language
        )
        db.add(bot_message)
        db.commit()
        db.refresh(bot_message)
        
        print(f"Bot response stored with ID: {bot_message.id}")
        
        # 6. Return response
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