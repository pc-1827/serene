from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    # We only need minimal user fields for reference
    # The actual user data is in the auth service

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    is_bot = Column(Boolean, default=False)
    message_text = Column(Text)
    translated_text = Column(Text)
    language = Column(String)
    created_at = Column(DateTime, default=func.now())

class SentimentScore(Base):
    __tablename__ = "sentiment_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    chat_message_id = Column(Integer, ForeignKey("chat_messages.id"))
    score = Column(Float)
    label = Column(String)
    recorded_at = Column(DateTime, default=func.now())

# Add a new model for storing chat sessions
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_data = Column(Text)  # JSON string of chat history
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())