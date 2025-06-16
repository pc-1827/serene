from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    # We don't need all user fields since we're just referencing

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    is_bot = Column(Boolean, default=False)
    message_text = Column(Text)
    translated_text = Column(Text)
    language = Column(String)
    created_at = Column(DateTime, default=func.now())
    
    sentiment_scores = relationship("SentimentScore", back_populates="chat_message")
    user = relationship("User")

class SentimentScore(Base):
    __tablename__ = "sentiment_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    chat_message_id = Column(Integer, ForeignKey("chat_messages.id"))
    score = Column(Float)
    label = Column(String)
    recorded_at = Column(DateTime, default=func.now())
    
    chat_message = relationship("ChatMessage", back_populates="sentiment_scores")
    user = relationship("User")

class VideoSentiment(Base):
    __tablename__ = "video_sentiments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    video_id = Column(String)
    emotion = Column(String)
    count = Column(Integer)
    percentage = Column(Float)
    recorded_at = Column(DateTime, default=func.now())
    
    user = relationship("User")