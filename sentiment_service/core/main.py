from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from datetime import datetime, timedelta
import pandas as pd
import json

from .database import get_db
from .models import User, ChatMessage, SentimentScore
from .schemas import SentimentRequest, SentimentResponse, DailySentiment

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Sentiment Analysis Service"}

@app.post("/sentiment/report", response_model=SentimentResponse)
def get_sentiment_report(request: SentimentRequest, db: Session = Depends(get_db)):
    """
    Generate a sentiment report for a user over the last n days.
    Returns daily averages for all sentiment labels.
    """
    # Check if user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate the date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=request.days)
    
    # Query for chat messages and their sentiment scores
    query = (
        db.query(
            ChatMessage.id,
            ChatMessage.created_at,
            SentimentScore.label,
            func.avg(SentimentScore.score).label("avg_score")
        )
        .join(SentimentScore, ChatMessage.id == SentimentScore.chat_message_id)
        .filter(ChatMessage.user_id == request.user_id)
        .filter(ChatMessage.created_at >= start_date)
        .filter(ChatMessage.created_at <= end_date)
        .filter(ChatMessage.is_bot == False)  # Only analyze user messages
        .group_by(
            func.date_trunc('day', ChatMessage.created_at),
            SentimentScore.label,
            ChatMessage.id
        )
        .order_by(ChatMessage.created_at)
    )
    
    results = query.all()
    
    if not results:
        raise HTTPException(status_code=404, detail="No sentiment data found for this user in the specified date range")
    
    # Get all available sentiment labels
    labels_query = db.query(SentimentScore.label).distinct().all()
    available_labels = [label[0] for label in labels_query]
    
    # Convert to pandas DataFrame for easier manipulation
    df = pd.DataFrame([
        {
            "message_id": r.id,
            "date": r.created_at.date(),
            "label": r.label,
            "score": r.avg_score
        } for r in results
    ])
    
    # Group by date and label, then calculate daily averages
    daily_avg = df.groupby(['date', 'label'])['score'].mean().reset_index()
    
    # Transform into the required output format
    daily_sentiments = []
    for date in sorted(df['date'].unique()):
        day_data = daily_avg[daily_avg['date'] == date]
        
        # Create a dictionary of label -> score for this day
        labels_dict = {row['label']: row['score'] for _, row in day_data.iterrows()}
        
        # Fill in missing labels with None
        for label in available_labels:
            if label not in labels_dict:
                labels_dict[label] = None
        
        daily_sentiments.append(DailySentiment(
            date=date,
            labels=labels_dict
        ))
    
    return SentimentResponse(
        user_id=request.user_id,
        daily_sentiments=daily_sentiments,
        available_labels=available_labels
    )