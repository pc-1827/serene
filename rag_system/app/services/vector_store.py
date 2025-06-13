import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self, resources):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.resources = resources
        self.index = None
        self.embeddings = None
        self.build_index()

    def build_index(self):
        texts = [r["text"] for r in self.resources]
        self.embeddings = self.model.encode(texts, show_progress_bar=False)
        self.index = faiss.IndexFlatL2(self.embeddings.shape[1])
        self.index.add(np.array(self.embeddings, dtype=np.float32))

    def query(self, query_text, top_k=3):
        query_vec = self.model.encode([query_text])
        D, I = self.index.search(np.array(query_vec, dtype=np.float32), top_k)
        return [self.resources[i] for i in I[0]]
