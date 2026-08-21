import re
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.config import settings

logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

_cached_embedding_model: Optional[str] = None

def get_best_embedding_model() -> str:
    return settings.EMBEDDING_MODEL or "models/text-embedding-004"

def split_text_into_chunks(text: str, chunk_size: int = 650, overlap: int = 100) -> List[str]:
    """Découpe un texte en morceaux sémantiques robustes sans boucle infinie."""
    if not text:
        return []
    
    cleaned_text = re.sub(r'\s+', ' ', text).strip()
    text_len = len(cleaned_text)
    if text_len <= chunk_size:
        return [cleaned_text]
        
    chunks = []
    start = 0
    
    while start < text_len:
        end = min(start + chunk_size, text_len)
        
        if end < text_len:
            window = cleaned_text[max(start, end - 150):end]
            last_punct = -1
            for p in ['. ', '! ', '? ', '.\n', ';\n', '; ', ' - ']:
                idx = window.rfind(p)
                if idx > last_punct:
                    last_punct = idx + len(p)
            
            if last_punct > 0:
                end = max(start, end - 150) + last_punct
        
        chunk = cleaned_text[start:end].strip()
        if chunk:
            chunks.append(chunk)
            
        next_start = end - overlap
        if next_start <= start:
            start = end
        else:
            start = next_start
            
    return chunks

def generate_embedding(text: str) -> List[float]:
    """Calcule l'embedding vectoriel d'un texte via Gemini (768 dimensions)."""
    if not settings.GEMINI_API_KEY:
        return [0.0] * 768

    try:
        response = genai.embed_content(
            model=settings.EMBEDDING_MODEL or "models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document",
            output_dimensionality=768,
        )
        return response['embedding']
    except Exception as e:
        logger.warning(f"Embedding document fallback: {e}")
        return [0.0] * 768

def generate_query_embedding(text: str) -> List[float]:
    """Calcule l'embedding vectoriel d'une requête utilisateur (768 dimensions)."""
    if not settings.GEMINI_API_KEY:
        return [0.0] * 768

    try:
        response = genai.embed_content(
            model=settings.EMBEDDING_MODEL or "models/gemini-embedding-001",
            content=text,
            task_type="retrieval_query",
            output_dimensionality=768,
        )
        return response['embedding']
    except Exception as e:
        logger.warning(f"Embedding query fallback: {e}")
        return [0.0] * 768
