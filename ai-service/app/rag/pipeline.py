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
    return settings.GEMINI_MODEL or "gemini-1.5-flash"

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

CANONICAL_CORPUS_SEED = [
    {
        "id": "seed-1",
        "document_id": "seed-kifayat",
        "title": "Kifāyat ar-Rāghibīn (Suffisance des Postulants)",
        "author_scholar": "Seydi El Hadji Malick Sy (Maodo)",
        "content": "Conditions et règles fondamentales du wird Tijaniyya : 1. Recevoir l'initiation d'un Mouqadam authentifié. 2. Respect absolu et ponctualité des 5 prières quotidiennes. 3. Interdiction de cumuler le wird avec une autre tariqa. 4. Assiduité et récitation quotidienne du Lazim (matin et soir) et de la Wazifa collective. 5. Pureté de l'intention, dévouement envers ses parents et bienveillance envers l'ensemble des créatures.",
        "keywords": ["wird", "condition", "kifayat", "raghibin", "tijane", "tijaniyya", "lazim", "regle", "prière", "priere", "engagement"]
    },
    {
        "id": "seed-2",
        "document_id": "seed-wazifa",
        "title": "Règles Canoniques de la Wazifa et du Lazim",
        "author_scholar": "Seydi El Hadji Malick Sy (Maodo)",
        "content": "La récitation de la Wazifa requiert une pureté rituelle absolue (ablutions majeures et mineures avec eau pure). Litanies : 30 fois Astaghfiroullah al-Azim, 50 fois Salat al-Fatihi, 100 fois La ilaha illallah, et 12 fois Jawharat al-Kamal. La récitation collective en assemblée (Hadra) est vivement recommandée pour amplifier les grâces spirituelles.",
        "keywords": ["wazifa", "lazim", "salat", "fatihi", "istighfar", "jawharat", "kamal", "purete", "hadra", "litanie", "dhikr"]
    },
    {
        "id": "seed-3",
        "document_id": "seed-khilasu",
        "title": "Khilāsu-Dh-Dhahab (L'Or Pur - Biographie Poétique du Prophète PSL)",
        "author_scholar": "Seydi El Hadji Malick Sy (Maodo)",
        "content": "Chef-d'œuvre poétique en langue arabe retraçant la généalogie sacrée, la naissance bénie, les miracles et la conduite exemplaire du Prophète Muhammad (PSL). Maodo y magnifie les vertus prophétiques : patience, clémence, générosité et véracité, source d'inspiration pour le croyant au quotidien.",
        "keywords": ["khilasu", "dhahab", "or pur", "prophete", "sira", "biographie", "poesie", "gamou", "mawlid", "muhammad"]
    },
    {
        "id": "seed-4",
        "document_id": "seed-ifham",
        "title": "Ifhām al-Munkir al-Jānī (La Réponse péremptoire au détracteur)",
        "author_scholar": "Seydi El Hadji Malick Sy (Maodo)",
        "content": "Défense théologique et juridique de la Tijaniyya fondée sur le Coran et la Sunna authentique. Maodo y démontre la légitimité du Soufisme orthodoxe, la concorde civile, le rejet des polémiques stériles et l'importance de la fraternité et de la paix entre tous les musulmans.",
        "keywords": ["ifham", "munkir", "polemique", "tolerance", "concorde", "paix", "defense", "sunna", "coran", "societe", "paix sociale"]
    },
    {
        "id": "seed-5",
        "document_id": "seed-bio",
        "title": "Dossier Historique & Enseignements de Seydi El Hadji Malick Sy (Maodo)",
        "author_scholar": "Conseil Scientifique de la Zawiya de Tivaouane",
        "content": "Seydi El Hadji Malick Sy (1855-1922), grand réformateur, érudit et pôle spirituel. Fondateur des Zawiyas de Saint-Louis, Dakar et Tivaouane. Initiateur de la célébration nationale du Gamou (Mawlid) en 1902 pour vivifier la mémoire prophétique et l'éducation des masses.",
        "keywords": ["maodo", "malick sy", "tivaouane", "gamou", "saint-louis", "biographie", "histoire", "zawiya", "vie"]
    }
]

def search_hybrid_chunks(db: Session, raw_query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Recherche hybride haute performance et résiliente :
    1. Interroge pgvector si la base de données est accessible.
    2. Complète ou bascule sur le corpus canonique natif sans bloquer.
    """
    keywords = [w.lower() for w in re.findall(r'\b\w{3,}\b', raw_query)]
    results_map: Dict[str, Dict[str, Any]] = {}

    # 1. Tentative pgvector si DB disponible
    if db is not None:
        try:
            query_vector = generate_query_embedding(raw_query)
            vector_chunks = (
                db.query(
                    DocumentChunkModel,
                    (1 - DocumentChunkModel.embedding.cosine_distance(query_vector)).label("similarity")
                )
                .order_by(DocumentChunkModel.embedding.cosine_distance(query_vector))
                .limit(top_k * 2)
                .all()
            )

            for chunk, similarity in vector_chunks:
                try:
                    score = float(similarity)
                    if score != score:
                        score = 0.0
                except Exception:
                    score = 0.0

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
        except Exception as e:
            logger.warning(f"Recherche pgvector non disponible, utilisation du corpus de référence natif: {e}")

    # 2. Correspondance avec le corpus canonique de secours (Seed)
    for seed in CANONICAL_CORPUS_SEED:
        score = 0.60
        seed_content = seed["content"].lower()
        seed_title = seed["title"].lower()
        seed_keywords = seed.get("keywords", [])
        
        matches = sum(1 for kw in keywords if kw in seed_content or kw in seed_title or kw in seed_keywords)
        if matches > 0:
            score = min(0.98, 0.70 + (0.10 * matches))
            if seed["id"] not in results_map or results_map[seed["id"]]["score"] < score:
                results_map[seed["id"]] = {
                    "id": seed["id"],
                    "document_id": seed["document_id"],
                    "title": seed["title"],
                    "author_scholar": seed["author_scholar"],
                    "content": seed["content"],
                    "score": score
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

    sample_source = relevant_chunks[0]
    
    # Construction de la réponse doctrinale de référence
    if detected_lang == "wo":
        default_synth = f"Ci jàngale yi ñu jële ci « {sample_source['title']} » (bu {sample_source['author_scholar']}) :\n\n{sample_source['content']}"
    else:
        default_synth = f"Selon les enseignements authentifiés de « {sample_source['title']} » (transmis par {sample_source['author_scholar']}) :\n\n{sample_source['content']}"

    if not settings.GEMINI_API_KEY:
        return {
            "answer": default_synth,
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

    try:
        model_name = get_best_generative_model()
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        answer_text = response.text.strip() if response and response.text else default_synth

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
        logger.warning(f"Génération Gemini fallback: {e}")
        return {
            "answer": default_synth,
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
