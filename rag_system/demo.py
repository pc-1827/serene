from app.core.database import init_db
from app.services.sentiment_analyzer import SentimentAnalyzer
from app.services.resource_matcher import ResourceMatcher

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database ready.")

    print("Testing sentiment analysis...")
    analyzer = SentimentAnalyzer()
    texts = [
        "I feel so hopeless and can't go on.",
        "I'm anxious about my new baby.",
        "Today was a good day!"
    ]
    for text in texts:
        print(f"Text: {text}")
        print("Sentiment:", analyzer.analyze(text))

    print("Testing resource matcher...")
    matcher = ResourceMatcher()
    for text in texts:
        print(f"User message: {text}")
        print("Recommended resources:", matcher.recommend(text))
