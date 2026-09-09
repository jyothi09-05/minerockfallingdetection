"""
MineMind RAG - Offline Local Retrieval Augmented Generation Subsystem.
Zero external APIs, pure local vector embeddings and knowledge indexer.
"""

from .embeddings import LocalEmbeddingModel, CosineSimilarity
from .vector_store import VectorStore, DocumentChunk, SearchResult
from .pipeline import RAGPipeline, MarkdownDocumentLoader, RecursiveCharacterChunker

__all__ = [
    "LocalEmbeddingModel",
    "CosineSimilarity",
    "VectorStore",
    "DocumentChunk",
    "SearchResult",
    "RAGPipeline",
    "MarkdownDocumentLoader",
    "RecursiveCharacterChunker",
]
