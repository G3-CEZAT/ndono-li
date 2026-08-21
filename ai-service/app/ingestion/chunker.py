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
    global _cached_embedding_model
    if _cached_embedding_model:
        return _cached_embedding_model

    if not settings.GEMINI_API_KEY:
        return "models/gemini-embedding-001"

    candidates = ["models/gemini-embedding-001", "models/gemini-embedding-2", "models/gemini-embedding-2-preview"]
    try:
        available_models = [m.name for m in genai.list_models() if 'embedContent' in m.supported_generation_methods]
        for c in candidates:
            if c in available_models:
                _cached_embedding_model = c
                logger.info(f"Modèle d'embedding Gemini sélectionné: {_cached_embedding_model}")
                return _cached_embedding_model
        if available_models:
            _cached_embedding_model = available_models[0]
            return _cached_embedding_model
    except Exception as e:
        logger.warning(f"Impossible de lister les modèles d'embedding: {e}")

    _cached_embedding_model = "models/gemini-embedding-001"
    return _cached_embedding_model

def split_text_into_chunks(text: str, chunk_size: int = 700, overlap: int = 100) -> List[str]:
    """Découpe un texte en morceaux en respectant les paragraphes et phrases."""
    if not text:
        return []
    
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
        
        punctuation_match = re.search(r'[.!?;\n][^\.\!?;\n]*$', cleaned_text[start:end])
        if punctuation_match:
            end = start + punctuation_match.start() + 1
        
        chunk = cleaned_text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start = end - overlap
        
    return chunks

def generate_embedding(text: str) -> List[float]:
    """Calcule l'embedding vectoriel d'un texte via Gemini (768 dimensions)."""
    if not settings.GEMINI_API_KEY:
        return [0.0] * 768

    model_name = get_best_embedding_model()
    try:
        response = genai.embed_content(
            model=model_name,
            content=text,
            task_type="retrieval_document",
            output_dimensionality=768,
        )
        return response['embedding']
    except Exception:
        try:
            response = genai.embed_content(
                model=model_name,
                content=text,
                output_dimensionality=768,
            )
            return response['embedding']
        except Exception as e:
            logger.error(f"Erreur calcul embedding document ({model_name}): {e}")
            return [0.0] * 768

def generate_query_embedding(text: str) -> List[float]:
    """Calcule l'embedding vectoriel d'une requête utilisateur (768 dimensions)."""
    if not settings.GEMINI_API_KEY:
        return [0.0] * 768

    model_name = get_best_embedding_model()
    try:
        response = genai.embed_content(
            model=model_name,
            content=text,
            task_type="retrieval_query",
            output_dimensionality=768,
        )
        return response['embedding']
    except Exception:
        try:
            response = genai.embed_content(
                model=model_name,
                content=text,
                output_dimensionality=768,
            )
            return response['embedding']
        except Exception as e:
            logger.error(f"Erreur calcul embedding query ({model_name}): {e}")
            return [0.0] * 768
