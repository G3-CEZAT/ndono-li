import re
from typing import List, Dict, Any
import google.generativeai as genai
from app.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def split_text_into_chunks(text: str, chunk_size: int = 700, overlap: int = 100) -> List[str]:
    """Découpe un texte en morceaux en respectant les paragraphes et phrases."""
    if not text:
        return []
    
    # Nettoyage des espaces multiples
    cleaned_text = re.sub(r'\s+', ' ', text).strip()
    
    if len(cleaned_text) <= chunk_size:
        return [cleaned_text]
        
    chunks = []
    start = 0
    while start < len(cleaned_text):
        end = start + chunk_size
        if end >= len(cleaned_text):
            chunks.append(cleaned_text[start:])
            break
        
        # Trouver la dernière ponctuation dans la fenêtre pour ne pas couper au milieu d'une phrase
        punctuation_match = re.search(r'[.!?;\n][^\.\!?;\n]*$', cleaned_text[start:end])
        if punctuation_match:
            end = start + punctuation_match.start() + 1
        
        chunk = cleaned_text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start = end - overlap
        
    return chunks

def generate_embedding(text: str) -> List[float]:
    """Calcule l'embedding vectoriel d'un texte via Gemini text-embedding-004."""
    if not settings.GEMINI_API_KEY:
        # Fallback pour test local sans clé active
        return [0.0] * 768

    response = genai.embed_content(
        model=settings.EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document",
    )
    return response['embedding']

def generate_query_embedding(text: str) -> List[float]:
    """Calcule l'embedding vectoriel d'une requête utilisateur."""
    if not settings.GEMINI_API_KEY:
        return [0.0] * 768

    response = genai.embed_content(
        model=settings.EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_query",
    )
    return response['embedding']
