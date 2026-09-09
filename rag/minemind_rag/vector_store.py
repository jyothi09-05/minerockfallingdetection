"""
Vector Store for MineMind AI RAG Pipeline.
In-memory and JSON-persisted vector storage with cosine similarity search and metadata filtering.
"""

import json
import os
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional
from .embeddings import CosineSimilarity, LocalEmbeddingModel


@dataclass
class DocumentChunk:
    chunk_id: str
    doc_id: str
    title: str
    category: str
    content: str
    embedding: List[float]
    metadata: Dict[str, Any]
    source_file: str


@dataclass
class SearchResult:
    chunk_id: str
    doc_id: str
    title: str
    category: str
    content: str
    score: float
    metadata: Dict[str, Any]
    source_file: str


class VectorStore:
    """
    Offline Vector Store supporting dense vector search, category partitioning,
    and metadata persistence.
    """

    def __init__(self, embedding_model: Optional[LocalEmbeddingModel] = None):
        self.embedding_model = embedding_model or LocalEmbeddingModel()
        self.chunks: Dict[str, DocumentChunk] = {}

    def add_chunk(self, chunk: DocumentChunk) -> None:
        """Adds or updates a chunk in the store."""
        self.chunks[chunk.chunk_id] = chunk

    def add_chunks(self, chunks: List[DocumentChunk]) -> None:
        """Batch adds chunks to the store."""
        for c in chunks:
            self.chunks[c.chunk_id] = c

    def count(self) -> int:
        """Returns total number of chunks stored."""
        return len(self.chunks)

    def get_categories(self) -> List[str]:
        """Returns unique categories present in the vector store."""
        return sorted(list({c.category for c in self.chunks.values()}))

    def search(
        self,
        query: str,
        top_k: int = 4,
        category: Optional[str] = None,
        min_score: float = 0.05
    ) -> List[SearchResult]:
        """
        Executes dense semantic similarity search for a query string.
        """
        if not self.chunks:
            return []

        query_vec = self.embedding_model.embed_text(query)
        scored_results: List[SearchResult] = []

        for chunk in self.chunks.values():
            if category and chunk.category.lower() != category.lower():
                continue

            sim = CosineSimilarity(query_vec, chunk.embedding)
            if sim >= min_score:
                scored_results.append(
                    SearchResult(
                        chunk_id=chunk.chunk_id,
                        doc_id=chunk.doc_id,
                        title=chunk.title,
                        category=chunk.category,
                        content=chunk.content,
                        score=round(float(sim), 4),
                        metadata=chunk.metadata,
                        source_file=chunk.source_file
                    )
                )

        # Sort descending by similarity score
        scored_results.sort(key=lambda r: r.score, reverse=True)
        return scored_results[:top_k]

    def save_to_file(self, filepath: str) -> None:
        """Persists the vector index and chunks to a JSON file."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        data = {
            "version": "1.0",
            "count": len(self.chunks),
            "chunks": [asdict(c) for c in self.chunks.values()]
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def load_from_file(self, filepath: str) -> bool:
        """Loads chunks from an existing JSON index file."""
        if not os.path.exists(filepath):
            return False
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.chunks.clear()
        for item in data.get("chunks", []):
            chunk = DocumentChunk(
                chunk_id=item["chunk_id"],
                doc_id=item["doc_id"],
                title=item["title"],
                category=item["category"],
                content=item["content"],
                embedding=item["embedding"],
                metadata=item.get("metadata", {}),
                source_file=item.get("source_file", "")
            )
            self.chunks[chunk.chunk_id] = chunk
        return True
