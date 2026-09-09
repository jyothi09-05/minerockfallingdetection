"""
RAG Pipeline for MineMind AI.
Includes Markdown Document Loading, Recursive Text Chunking, Indexing, and Query Retrieval with Citations.
"""

import os
import re
import glob
from typing import List, Dict, Any, Optional
from .embeddings import LocalEmbeddingModel
from .vector_store import VectorStore, DocumentChunk, SearchResult


class RecursiveCharacterChunker:
    """
    Splits long markdown documents into coherent, overlapping chunks
    by respecting structural boundaries (headers, paragraphs, lists).
    """

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 80):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n## ", "\n### ", "\n\n", "\n", ". "]

    def split_text(self, text: str) -> List[str]:
        """Recursively splits text into chunks of maximum size `chunk_size`."""
        if len(text) <= self.chunk_size:
            return [text.strip()] if text.strip() else []

        # Split on the largest matching separator
        chosen_sep = ""
        for sep in self.separators:
            if sep in text:
                chosen_sep = sep
                break

        if not chosen_sep:
            # Fallback hard character slice
            chunks = []
            for i in range(0, len(text), self.chunk_size - self.chunk_overlap):
                chunks.append(text[i:i + self.chunk_size])
            return [c.strip() for c in chunks if c.strip()]

        splits = text.split(chosen_sep)
        chunks: List[str] = []
        current_chunk: List[str] = []
        current_length = 0

        for s in splits:
            seg = s if chosen_sep in ["\n\n", "\n", ". "] else (chosen_sep + s)
            seg_len = len(seg)
            if current_length + seg_len > self.chunk_size and current_chunk:
                merged = "".join(current_chunk).strip()
                if merged:
                    chunks.append(merged)
                # Overlap: keep tail of previous chunk
                overlap_text = merged[-self.chunk_overlap:] if len(merged) > self.chunk_overlap else ""
                current_chunk = [overlap_text, seg]
                current_length = len(overlap_text) + seg_len
            else:
                current_chunk.append(seg)
                current_length += seg_len

        if current_chunk:
            merged = "".join(current_chunk).strip()
            if merged:
                chunks.append(merged)

        return chunks


class MarkdownDocumentLoader:
    """
    Loads markdown and text documents from a root directory, extracting frontmatter/headers.
    """

    @staticmethod
    def load_document(filepath: str) -> Dict[str, Any]:
        """Reads a markdown file and extracts title, category, and body."""
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            raw = f.read()

        category = os.path.basename(os.path.dirname(filepath))
        filename = os.path.basename(filepath)
        doc_id = os.path.splitext(filename)[0]

        # Extract title from first # Header or document filename
        title_match = re.search(r"^#\s+(.+)$", raw, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else doc_id.replace("_", " ").title()

        return {
            "doc_id": doc_id,
            "title": title,
            "category": category,
            "raw_text": raw,
            "filepath": filepath
        }


class RAGPipeline:
    """
    Main RAG subsystem coordinator.
    Indexes knowledge repositories and exposes unified semantic retrieval for LLMs.
    """

    def __init__(
        self,
        knowledge_base_dir: Optional[str] = None,
        vector_store: Optional[VectorStore] = None
    ):
        self.embedding_model = LocalEmbeddingModel()
        self.vector_store = vector_store or VectorStore(self.embedding_model)
        self.chunker = RecursiveCharacterChunker(chunk_size=450, chunk_overlap=80)
        self.knowledge_base_dir = knowledge_base_dir
        self.is_indexed = False

    def index_directory(self, root_dir: str) -> int:
        """
        Scans a directory for all .md and .txt files, chunks them, computes embeddings,
        and adds them to the vector store.
        """
        self.knowledge_base_dir = root_dir
        pattern = os.path.join(root_dir, "**", "*.md")
        files = glob.glob(pattern, recursive=True)
        txt_pattern = os.path.join(root_dir, "**", "*.txt")
        files.extend(glob.glob(txt_pattern, recursive=True))

        total_chunks = 0
        for fpath in files:
            doc = MarkdownDocumentLoader.load_document(fpath)
            raw_chunks = self.chunker.split_text(doc["raw_text"])

            for idx, text_chunk in enumerate(raw_chunks):
                chunk_id = f"{doc['doc_id']}_chk_{idx:03d}"
                emb = self.embedding_model.embed_text(text_chunk)
                chunk = DocumentChunk(
                    chunk_id=chunk_id,
                    doc_id=doc["doc_id"],
                    title=doc["title"],
                    category=doc["category"],
                    content=text_chunk,
                    embedding=emb,
                    metadata={"index": idx, "filename": os.path.basename(fpath)},
                    source_file=fpath
                )
                self.vector_store.add_chunk(chunk)
                total_chunks += 1

        self.is_indexed = True
        return total_chunks

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        category: Optional[str] = None,
        min_score: float = 0.05
    ) -> List[SearchResult]:
        """Retrieves most relevant chunks for a user query."""
        return self.vector_store.search(
            query=query,
            top_k=top_k,
            category=category,
            min_score=min_score
        )

    def format_context_for_prompt(self, results: List[SearchResult]) -> str:
        """Formats retrieved chunks into a prompt-ready context block with citations."""
        if not results:
            return "No relevant knowledge-base documents found for this query."

        formatted_blocks = []
        for i, res in enumerate(results, 1):
            formatted_blocks.append(
                f"--- [CITATION {i}]: {res.title} (Category: {res.category} | File: {res.doc_id}) ---\n"
                f"{res.content.strip()}"
            )
        return "\n\n".join(formatted_blocks)
