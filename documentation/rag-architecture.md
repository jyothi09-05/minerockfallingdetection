# MineMind AI — Local RAG & Semantic Vector Retrieval

## 1. Overview
The Retrieval-Augmented Generation (RAG) subsystem (`rag/minemind_rag/`) enables factual, evidence-grounded responses by retrieving relevant excerpts from indexed engineering manuals, safety SOPs, geotechnical benchmarks, and emergency procedures without requiring cloud embeddings or external vector database clusters.

```
                    ┌────────────────────────────────────────────────────────┐
                    │               Knowledge Base Documents                 │
                    │   (knowledge-base/{safety,geology,maintenance,...})   │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               MarkdownDocumentLoader                   │
                    │        - Header & Category Metadata Extraction         │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │             RecursiveCharacterChunker                  │
                    │        - Size: 450 chars | Overlap: 80 chars           │
                    │        - Splits on Markdown Headers & Paragraphs       │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │                LocalEmbeddingModel                     │
                    │        - Subword n-grams, stem hashing                 │
                    │        - 256-D Dense L2-Normalized Vectors             │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │                    VectorStore                         │
                    │        - Fast Cosine Similarity Matrix Scanning        │
                    │        - In-Memory + JSON Serializable Cache           │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                          Query ───────────────►┤
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │           Ranked SearchResults + Citations             │
                    │  [CIT-1] SOP-MM-SAF-001 (Relevance: 0.92, Category: SAF)│
                    └────────────────────────────────────────────────────────┘
```

## 2. Chunking & Overlap Mechanics
The `RecursiveCharacterChunker` preserves context by respecting structural boundaries in technical mining documentation:
- Primary split: `\n## ` (H2 Section boundaries)
- Secondary split: `\n### ` (H3 Sub-section boundaries)
- Paragraph split: `\n\n`
- Overlap buffer: 80 characters of preceding text prepended to ensure sentence continuity across chunk boundaries.

## 3. Local Dense Embedding Engine
The `LocalEmbeddingModel` calculates 256-dimensional unit vectors using:
- **Tokenization**: Lowercase normalization, alphanumeric sanitization, stop-word elimination.
- **Stem & N-Gram Generation**: Unigrams, word bigrams, subword stems, and character tri-grams.
- **Hashing Trick**: 256-bin hash projection with MD5 sign hashing $\in \{-1, +1\}$.
- **Domain Keyword Weighting**: Enhanced weighting factors for critical mining terms (`blast`, `slope`, `rockfall`, `crusher`, `radar`, `evacuation`).
- **L2 Sphere Normalization**: $\hat{v} = \frac{v}{\|v\|_2}$, allowing fast cosine similarity calculation via dot product: $\text{sim}(a, b) = a \cdot b$.
