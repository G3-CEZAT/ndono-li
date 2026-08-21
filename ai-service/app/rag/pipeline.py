import re
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.config import settings
from app.models import DocumentChunkModel
from app.ingestion.chunker import generate_query_embedding

logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

_cached_generative_model: Optional[str] = None

def get_best_generative_model() -> str:
    global _cached_generative_model
    if _cached_generative_model:
        return _cached_generative_model

    if not settings.GEMINI_API_KEY:
        return "gemini-3.6-flash"

    try:
        available_models = [m.name.replace("models/", "") for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        preferred = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-pro-latest"]
        for p in preferred:
            if p in available_models or f"models/{p}" in available_models:
                _cached_generative_model = p
                return _cached_generative_model
        if available_models:
            _cached_generative_model = available_models[0]
            return _cached_generative_model
    except Exception as e:
        logger.warning(f"Impossible de lister les modèles génératifs: {e}")

    _cached_generative_model = settings.GEMINI_MODEL.replace("models/", "")
    return _cached_generative_model

SYSTEM_PROMPT = """Tu es l'assistant officiel de la plateforme CEZAT, dédié à la diffusion fidèle et certifiée des enseignements religieux et spirituels de la communauté.

RÈGLES STRICTES ET NON NÉGOCIABLES :
1. Tu dois te baser EXCLUSIVEMENT sur les extraits de sources fournies par les érudits (ci-dessous).
2. Si les sources fournies ne contiennent pas la réponse, tu ne dois JAMAIS inventer de règle religieuse ou de récit. Tu dois clairement l'admettre avec humilité.
3. Si la question est posée en Wolof (ou que l'utilisateur a demandé du Wolof), réponds dans un Wolof respectueux, fluide, digne et compréhensible.
4. Si la question est posée en Français, réponds dans un Français soigné, clair et accessible.
5. Mentionne toujours la source ou le nom de l'érudit mentionné dans les textes.
"""

def detect_language_fast(text: str) -> str:
    """Détection ultra-rapide Wolof vs Français basée sur les marqueurs fréquents."""
    wolof_markers = [
        "naka", "ndax", "amul", "war", "julli", "diine", "ndigël", "bamba", "serigne",
        "dara", "rek", "rekk", "ñu", "nga", "sama", "sunu", "yoon", "ci", "ak", "bi", "gi", "wi", "yi", "mi"
    ]
    words = [w.lower() for w in re.findall(r'\b\w+\b', text)]
    wolof_count = sum(1 for w in words if w in wolof_markers)
    return "wo" if wolof_count >= 2 or (len(words) <= 3 and wolof_count >= 1) else "fr"

def search_hybrid_chunks(db: Session, raw_query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Recherche hybride haute performance :
    1. Recherche sémantique vectorielle via gemini-embedding-001.
    2. Correspondance textuelle directe par mots-clés.
    """
    query_vector = generate_query_embedding(raw_query)
    
    # 1. Recherche vectorielle pgvector
    vector_chunks = (
        db.query(
            DocumentChunkModel,
            (1 - DocumentChunkModel.embedding.cosine_distance(query_vector)).label("similarity")
        )
        .order_by(DocumentChunkModel.embedding.cosine_distance(query_vector))
        .limit(top_k * 2)
        .all()
    )

    keywords = [w.lower() for w in re.findall(r'\b\w{3,}\b', raw_query)]
    results_map: Dict[str, Dict[str, Any]] = {}

    for chunk, similarity in vector_chunks:
        try:
            score = float(similarity)
            if score != score:  # NaN check
                score = 0.0
        except Exception:
            score = 0.0

        # Boost de score si présence de mots-clés dans le titre ou contenu
        content_lower = chunk.content.lower()
        title_lower = chunk.title.lower()
        keyword_hits = sum(1 for kw in keywords if kw in content_lower or kw in title_lower)
        if keyword_hits > 0:
            score = min(1.0, score + (0.15 * keyword_hits))

        results_map[chunk.id] = {
            "id": chunk.id,
            "document_id": chunk.document_id,
            "title": chunk.title,
            "author_scholar": chunk.author_scholar,
            "content": chunk.content,
            "score": score
        }

    # 2. Recherche textuelle directe pour les mots-clés spécifiques
    if keywords:
        search_filters = [DocumentChunkModel.content.ilike(f"%{kw}%") for kw in keywords]
        search_filters += [DocumentChunkModel.title.ilike(f"%{kw}%") for kw in keywords]
        keyword_chunks = db.query(DocumentChunkModel).filter(or_(*search_filters)).limit(top_k).all()

        for chunk in keyword_chunks:
            if chunk.id not in results_map:
                results_map[chunk.id] = {
                    "id": chunk.id,
                    "document_id": chunk.document_id,
                    "title": chunk.title,
                    "author_scholar": chunk.author_scholar,
                    "content": chunk.content,
                    "score": 0.78
                }

    sorted_results = sorted(results_map.values(), key=lambda x: x["score"], reverse=True)
    return sorted_results[:top_k]

def run_rag_pipeline(
    db: Session,
    question: str,
    history: List[Dict[str, str]] = [],
    language_preference: Optional[str] = None
) -> Dict[str, Any]:
    """Pipeline RAG ultra-rapide et certifié avec recherche hybride."""
    
    detected_lang = language_preference or detect_language_fast(question)

    # 1. Recherche hybride immédiate dans pgvector
    chunks = search_hybrid_chunks(db, raw_query=question, top_k=4)

    # 2. Seuil de similarité
    threshold = 0.50
    relevant_chunks = [c for c in chunks if c["score"] >= threshold]

    if not relevant_chunks:
        if detected_lang == "wo":
            fallback_msg = "Laaj bii amagul tontu bu wér ci jàngale yi ñu yore te érudits yi gëstu ko. Yónnee nañu ko komite bi ngir ñu leeral ko ci kanam."
        else:
            fallback_msg = "Cette question ne figure pas encore dans les enseignements certifiés mis à ma disposition par les érudits. Elle a été transmise au comité scientifique pour réponse officielle."

        return {
            "answer": fallback_msg,
            "isFound": False,
            "sources": [],
            "detectedLanguage": detected_lang,
        }

    # 3. Construction du prompt certifié
    context_text = ""
    for i, c in enumerate(relevant_chunks, 1):
        context_text += f"\n--- SOURCE {i} : {c['title']} (Auteur/Érudit: {c['author_scholar']}) ---\n{c['content']}\n"

    history_context = ""
    if history:
        history_context = "Historique récent de la discussion :\n"
        for msg in history[-4:]:
            role_label = "Pèlerin" if msg.get("sender") == "USER" else "Assistant"
            history_context += f"{role_label}: {msg.get('content')}\n"

    prompt = f"""{SYSTEM_PROMPT}

{history_context}

SOURCES CERTIFIÉES DES ÉRUDITS :
{context_text}

QUESTION DU PÈLERIN : {question}
LANGUE DE RÉPONSE REQUISE : {'Wolof' if detected_lang == 'wo' else 'Français'}

Formule ta réponse certifiée avec bienveillance et clarté, en citant les sources et érudits pertinents."""

    if not settings.GEMINI_API_KEY:
        sample_source = relevant_chunks[0]
        return {
            "answer": f"[Mode Simulation RAG] D'après '{sample_source['title']}' par {sample_source['author_scholar']} : {sample_source['content'][:250]}...",
            "isFound": True,
            "sources": [
                {
                    "documentTitle": c["title"],
                    "authorScholar": c["author_scholar"],
                    "score": c["score"],
                    "chunkContent": c["content"]
                }
                for c in relevant_chunks
            ],
            "detectedLanguage": detected_lang
        }

    try:
        model_name = get_best_generative_model()
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        answer_text = response.text.strip()

        return {
            "answer": answer_text,
            "isFound": True,
            "sources": [
                {
                    "documentTitle": c["title"],
                    "authorScholar": c["author_scholar"],
                    "score": round(c["score"], 3),
                    "chunkContent": c["content"]
                }
                for c in relevant_chunks
            ],
            "detectedLanguage": detected_lang
        }
    except Exception as e:
        logger.error(f"Erreur génération Gemini: {e}")
        return {
            "answer": "Une erreur temporaire est survenue lors de la consultation des enseignements. Veuillez réessayer.",
            "isFound": False,
            "sources": [],
            "detectedLanguage": detected_lang
        }
