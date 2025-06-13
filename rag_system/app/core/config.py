import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

VECTOR_INDEX_PATH = os.path.join(DATA_DIR, "faiss_index")
RESOURCE_DB_PATH = os.path.join(DATA_DIR, "resources.json")
CRISIS_KEYWORDS_PATH = os.path.join(DATA_DIR, "crisis_keywords.json")
USER_DB_PATH = os.path.join(BASE_DIR, "mental_health.db")
