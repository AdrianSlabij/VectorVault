import numpy as np
from typing import List
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class NormalizedGoogleEmbeddings(GoogleGenerativeAIEmbeddings):
    """
    Helper class for overriding GoogleGenerativeAiEmbeddings from langchain to provide the strucutre needed to database.
    Can also control embedding size as per: https://ai.google.dev/gemini-api/docs/embeddings
    """
    def _normalize_vector(self, vector: List[float]) -> List[float]:
        """Normalizes a single vector to unit length."""
        arr = np.array(vector)
        norm = np.linalg.norm(arr)
        # Avoid division by zero
        if norm == 0:
            return vector
        
        #print(f"Normed embedding length: {len(arr / norm)}")
        #print(f"Norm of normed embedding, should be close to 1: {np.linalg.norm(arr / norm):.6f}") # Should be very close to 1
        return (arr / norm).tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Overridden method to normalize document chunks."""
        # 1. Get the raw embeddings from Google
        raw_embeddings = super().embed_documents(texts)
        # 2. Normalize each one
        return [self._normalize_vector(e) for e in raw_embeddings]

    def embed_query(self, text: str) -> List[float]:
        """Overridden method to normalize the search query."""
        # 1. Get raw embedding
        raw_embedding = super().embed_query(text)
        # 2. Normalize it
        return self._normalize_vector(raw_embedding)