from fastapi import APIRouter
from app.api.schemas import ChatRequest, ChatResponse, Resource, SentimentAnalysis
from app.services.sentiment_analyzer import SentimentAnalyzer
from app.services.resource_matcher import ResourceMatcher
from app.services.personalization import save_user_message, get_user_history

router = APIRouter()

sentiment_analyzer = SentimentAnalyzer()
resource_matcher = ResourceMatcher()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    sentiment = sentiment_analyzer.analyze(request.message)
    save_user_message(request.user_id, request.message, sentiment["compound"])
    resources = resource_matcher.recommend(request.message)
    # Crisis detection (simple): if negative sentiment and certain keywords
    crisis_alert = sentiment["emotional_state"] == "negative" and any(
        word in request.message.lower() for word in ["suicide", "hopeless", "end it", "can't go on"]
    )
    user_history = None
    if request.include_context:
        user_history = get_user_history(request.user_id)
    return ChatResponse(
        sentiment_analysis=SentimentAnalysis(**sentiment),
        recommended_resources=[Resource(**r) for r in resources],
        user_history=user_history,
        crisis_alert=crisis_alert
    )
