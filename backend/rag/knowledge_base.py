import re
import math
from typing import List, Dict, Any, Optional
from backend.rag.documents_data import KNOWLEDGE_DOCUMENTS

class VectorKnowledgeBase:
    def __init__(self):
        self.documents = list(KNOWLEDGE_DOCUMENTS)
        self.chunks: List[Dict[str, Any]] = []
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9_\-\.\°]+\b', text.lower())

    def _build_index(self):
        self.chunks = []
        for doc in self.documents:
            for ch in doc.get("chunks", []):
                chunk_entry = {
                    "id": ch["id"],
                    "document_id": doc["id"],
                    "document_title": doc["title"],
                    "filename": doc["filename"],
                    "category": doc["category"],
                    "section": ch["section"],
                    "content": ch["content"],
                    "keywords": ch.get("keywords", []),
                    "tokens": self._tokenize(ch["content"] + " " + ch["section"] + " " + " ".join(ch.get("keywords", [])))
                }
                self.chunks.append(chunk_entry)

    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        query_tokens = set(self._tokenize(query))
        if not query_tokens:
            return []

        results = []
        for chunk in self.chunks:
            chunk_tokens = chunk["tokens"]
            if not chunk_tokens:
                continue

            # Calculate token intersection and keyword boost
            matched_tokens = query_tokens.intersection(chunk_tokens)
            base_score = len(matched_tokens) / (math.sqrt(len(query_tokens)) * math.sqrt(len(chunk_tokens)) + 1e-5)

            # Boost if keyword directly appears
            keyword_matches = sum(1 for kw in chunk["keywords"] if any(qt in kw.lower() for qt in query_tokens))
            boost = keyword_matches * 0.18

            relevance = min(0.99, max(0.15, base_score * 3.5 + boost))

            if matched_tokens or keyword_matches > 0:
                results.append({
                    "id": chunk["id"],
                    "document_id": chunk["document_id"],
                    "document_title": chunk["document_title"],
                    "filename": chunk["filename"],
                    "category": chunk["category"],
                    "section": chunk["section"],
                    "content": chunk["content"],
                    "relevance": round(relevance, 2),
                    "relevance_pct": f"{int(round(relevance * 100))}%"
                })

        # Sort descending by relevance
        results.sort(key=lambda x: x["relevance"], reverse=True)
        return results[:top_k]

    def add_document(self, title: str, category: str, filename: str, content: str, sections_chunks: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        doc_id = f"DOC-USER-{len(self.documents) + 1:03d}"
        chunks_list = []
        if sections_chunks:
            for idx, sc in enumerate(sections_chunks):
                chunks_list.append({
                    "id": f"CHUNK-{doc_id}-{idx+1:02d}",
                    "section": sc.get("section", f"Section {idx+1}"),
                    "content": sc.get("content", ""),
                    "keywords": self._tokenize(sc.get("content", ""))[:8]
                })
        else:
            # Auto-chunk by paragraphs
            paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
            for idx, p in enumerate(paragraphs):
                chunks_list.append({
                    "id": f"CHUNK-{doc_id}-{idx+1:02d}",
                    "section": f"Section {idx+1}",
                    "content": p,
                    "keywords": self._tokenize(p)[:8]
                })

        new_doc = {
            "id": doc_id,
            "title": title,
            "category": category,
            "filename": filename,
            "uploaded_at": "2026-10-01T12:00:00Z",
            "filesize": f"{max(0.4, round(len(content)/1024, 1))} KB",
            "sections_count": len(chunks_list),
            "is_simulated": True,
            "description": f"User ingested technical document: {title}",
            "chunks": chunks_list
        }
        self.documents.append(new_doc)
        self._build_index()
        return new_doc

knowledge_base = VectorKnowledgeBase()
