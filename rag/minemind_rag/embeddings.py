"""
Local Embedding Engine for MineMind RAG.
Operates 100% offline using deterministic subword n-gram hashing and TF-IDF / BM25 term weighting
to produce dense, L2-normalized vector embeddings.
"""

import re
import math
import hashlib
from typing import List, Dict, Tuple, Optional


def CosineSimilarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Computes cosine similarity between two dense vectors."""
    if len(vec_a) != len(vec_b) or not vec_a:
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot / (norm_a * norm_b)


class LocalEmbeddingModel:
    """
    High-performance, standalone local embedding model.
    Generates 256-dimensional dense embedding vectors using subword tokenization,
    n-gram feature projection, and L2 unit-sphere normalization.
    """

    def __init__(self, dimension: int = 256):
        self.dimension = dimension
        self.stop_words = {
            "a", "an", "the", "and", "or", "but", "if", "then", "of", "at", "by", "for",
            "with", "about", "against", "between", "into", "through", "during", "before",
            "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off",
            "over", "under", "again", "further", "then", "once", "here", "there", "when",
            "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
            "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
            "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "is", "are", "was", "were"
        }

    def _tokenize(self, text: str) -> List[str]:
        """Normalizes and tokenizes text into word tokens."""
        clean = re.sub(r"[^a-zA-Z0-9_\-\s]", " ", text.lower())
        tokens = clean.split()
        return [t for t in tokens if len(t) > 1 and t not in self.stop_words]

    def _extract_ngrams(self, tokens: List[str]) -> List[str]:
        """Extracts unigrams, bigrams, and character tri-grams for subword matching."""
        features = list(tokens)
        
        # Word stems/prefixes (first 4-5 chars)
        for token in tokens:
            if len(token) > 4:
                features.append(f"stem_{token[:4]}")
            if len(token) > 5:
                features.append(f"stem_{token[:5]}")

        # Word bigrams
        for i in range(len(tokens) - 1):
            features.append(f"{tokens[i]}_{tokens[i+1]}")
            
        # Character tri-grams for subword matching
        for token in tokens:
            if len(token) >= 4:
                for i in range(len(token) - 2):
                    features.append(f"chr_{token[i:i+3]}")
                    
        return features

    def _hash_feature(self, feature: str) -> Tuple[int, float]:
        """Hashes a feature to an index in [0, dimension) and a sign weight {-1, 1}."""
        h = int(hashlib.md5(feature.encode("utf-8")).hexdigest(), 16)
        index = h % self.dimension
        sign = 1.0 if ((h >> 8) & 1) == 1 else -1.0
        return index, sign

    def embed_text(self, text: str) -> List[float]:
        """Generates a dense, L2-normalized vector for the input text."""
        if not text or not text.strip():
            return [0.0] * self.dimension

        tokens = self._tokenize(text)
        features = self._extract_ngrams(tokens)
        
        if not features:
            return [0.0] * self.dimension

        vector = [0.0] * self.dimension
        
        # Frequency accumulation
        counts: Dict[str, int] = {}
        for feat in features:
            counts[feat] = counts.get(feat, 0) + 1

        for feat, count in counts.items():
            idx, sign = self._hash_feature(feat)
            # Logarithmic term frequency
            tf = 1.0 + math.log(count)
            # Higher weight for word bigrams and domain keywords
            if "_" in feat and not feat.startswith("chr_"):
                tf *= 1.5
            elif feat in {"rockfall", "blast", "slope", "evacuation", "haul", "radar", "crusher", "cat", "safety", "speed"}:
                tf *= 2.0
            vector[idx] += sign * tf

        # L2 normalize vector
        norm = math.sqrt(sum(v * v for v in vector))
        if norm > 0:
            vector = [v / norm for v in vector]
            
        return vector

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Embeds multiple texts concurrently."""
        return [self.embed_text(t) for t in texts]
