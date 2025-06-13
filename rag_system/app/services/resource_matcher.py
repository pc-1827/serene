import json
from app.services.vector_store import VectorStore
from app.core.config import RESOURCE_DB_PATH

def load_resources():
    with open(RESOURCE_DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

class ResourceMatcher:
    def __init__(self):
        self.resources = load_resources()
        self.vector_store = VectorStore(self.resources)

    def recommend(self, message, top_k=3):
        return self.vector_store.query(message, top_k=top_k)
