# RAG (Retrieval-Augmented Generation) Module

## Purpose
The **RAG** module manages offline vector embeddings and semantic search across mining standard operating procedures (SOPs), geotechnical manuals, equipment maintenance handbooks, and historical incident investigations.

## Architecture
- **Vector Database**: Local FAISS / pgvector index
- **Embedding Model**: Local offline SentenceTransformers / BGE embeddings
- **Chunking Pipeline**: Mining-specific hierarchical Markdown / PDF document parser
- **Hybrid Search**: Dense semantic vector similarity + Sparse BM25 lexical keyword matching

## Phase 1 Status
Local storage and vector integration contracts defined.
