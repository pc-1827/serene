import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

class SentimentAnalyzer:
    def __init__(self):
        try:
            nltk.data.find('sentiment/vader_lexicon.zip')
        except LookupError:
            nltk.download('vader_lexicon')
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text: str):
        scores = self.analyzer.polarity_scores(text)
        compound = scores['compound']
        if compound >= 0.05:
            emotion = "positive"
        elif compound <= -0.05:
            emotion = "negative"
        else:
            emotion = "neutral"
        return {
            "compound": compound,
            "positive": scores['pos'],
            "negative": scores['neg'],
            "neutral": scores['neu'],
            "emotional_state": emotion
        }
