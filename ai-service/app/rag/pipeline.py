import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from sqlalchemy.orm import Session
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
        return "gemini-1.5-flash"

    try:
        available_models = [m.name.replace("models/", "") for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        # Préférer flash ou pro
        preferred = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"]
        for p in preferred:
            if p in available_models or f"models/{p}" in available_models:
                _cached_generative_model = p
                logger.info(f"Modèle génératif Gemini sélectionné: {_cached_generative_model}")
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
2. Si les sources fournies ne contiennent pas explicitement la réponse, tu ne dois JAMAIS inventer de règle religieuse, de fatwa ou de récit. Tu dois clairement l'admettre avec humilité.
3. Si la question est posée en Wolof (ou que l'utilisateur a demandé du Wolof), réponds dans un Wolof respectueux, fluide, digne et compréhensible.
4. Si la question est posée en Français, réponds dans un Français soigné, clair et accessible.
5. Mentionne toujours la source ou le nom de l'érudit mentionné dans les textes.
"""

def analyze_and_expand_query(question: str) -> Dict[str, str]:
    """Analyse la langue de la question et génère une reformulation pour optimiser la recherche vectorielle."""
    if not settings.GEMINI_API_KEY:
        return {"expanded_query": question, "detected_language": "fr"}

    try:
        model_name = get_best_generative_model()
        model = genai.GenerativeModel(model_name)
        prompt = f"""Analyse cette question d'un fidèle : "{question}".
Tâche :
1. Détecte la langue principale (français = 'fr', wolof = 'wo').
2. Reformule la question en français standardisé avec les termes islamiques/spirituels précis (en arabe ou français) pour une recherche dans une base documentaire religieuse.

Réponds sous le format exact :
LANG: <fr ou wo>
QUERY: <question reformulée en français>"""

        response = model.generate_content(prompt)
        text = response.text.strip()
        
        detected_lang = "fr"
        expanded_query = question

        for line in text.splitlines():
            if line.startswith("LANG:"):
                detected_lang = line.replace("LANG:", "").strip().lower()
            elif line.startswith("QUERY:"):
                expanded_query = line.replace("QUERY:", "").strip()

        return {"expanded_query": expanded_query, "detected_language": detected_lang}
    except Exception as e:
        logger.error(f"Erreur reformulation query: {e}")
        return {"expanded_query": question, "detected_language": "fr"}

def search_similar_chunks(db: Session, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
    """Recherche les chunks les plus similaires dans PostgreSQL avec pgvector."""
    query_vector = generate_query_embedding(query)
    
    chunks = (
        db.query(
            DocumentChunkModel,
            (1 - DocumentChunkModel.embedding.cosine_distance(query_vector)).label("similarity")
        )
        .order_by(DocumentChunkModel.embedding.cosine_distance(query_vector))
        .limit(top_k)
        .all()
    )

    results = []
    for chunk, similarity in chunks:
        score = float(similarity)
        results.append({
            "id": chunk.id,
            "document_id": chunk.document_id,
            "title": chunk.title,
            "author_scholar": chunk.author_scholar,
            "content": chunk.content,
            "score": score
        })
    return results

def run_rag_pipeline(
    db: Session,
    question: str,
    history: List[Dict[str, str]] = [],
    language_preference: Optional[str] = None
) -> Dict[str, Any]:
    """Pipeline RAG complet avec gestion Wolof/FR, recherche pgvector et garde-fous stricts."""
    
    # 1. Analyse de la question et reformulation
    analysis = analyze_and_expand_query(question)
    detected_lang = language_preference or analysis.get("detected_language", "fr")
    expanded_query = analysis.get("expanded_query", question)

    # 2. Recherche vectorielle dans la base des érudits
    chunks = search_similar_chunks(db, expanded_query, top_k=4)

    # 3. Filtrage par seuil de similarité stricte
    threshold = settings.SIMILARITY_THRESHOLD
    relevant_chunks = [c for c in chunks if c["score"] >= threshold]

    if not relevant_chunks:
        # Aucune source certifiée trouvée
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

    # 4. Construction du contexte certifié pour Gemini
    context_text = ""
    for i, c in enumerate(relevant_chunks, 1):
        context_text += f"\n--- SOURCE {i} : {c['title']} (Auteur/Érudit: {c['author_scholar']}) ---\n{c['content']}\n"

    # Construction de l'historique de conversation récent
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

Formule ta réponse certifiée avec bienveillance, en citant les sources et érudits pertinents."""

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
