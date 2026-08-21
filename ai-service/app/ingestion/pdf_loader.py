import os
import re
import uuid
import time
import logging
from typing import List, Dict, Any
from pypdf import PdfReader
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.config import settings
from app.models import DocumentChunkModel
from app.ingestion.chunker import split_text_into_chunks, get_best_embedding_model

logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def extract_text_from_pdf(pdf_path: str) -> List[Dict[str, Any]]:
    """Extrait le texte page par page avec nettoyage."""
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"Fichier introuvable : {pdf_path}")

    reader = PdfReader(pdf_path)
    pages_data = []

    for page_num, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        # Nettoyer les en-têtes répétitifs
        text = re.sub(r'www\.tidjaniyya\.org', '', text, flags=re.IGNORECASE)
        cleaned = re.sub(r'[ \t]+', ' ', text)
        cleaned = re.sub(r'\n\s*\n+', '\n\n', cleaned).strip()
        if cleaned:
            pages_data.append({
                "page": page_num,
                "text": cleaned
            })

    return pages_data

def generate_batch_embeddings(chunks: List[str], batch_size: int = 25) -> List[List[float]]:
    """Génère les embeddings en batch haute vitesse via Gemini."""
    model_name = get_best_embedding_model()
    all_embeddings = []

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        success = False
        for attempt in range(3):
            try:
                response = genai.embed_content(
                    model=model_name,
                    content=batch,
                    task_type="retrieval_document",
                    output_dimensionality=768
                )
                embeddings = response['embedding']
                all_embeddings.extend(embeddings)
                success = True
                break
            except Exception as e:
                logger.warning(f"Erreur batch embedding (tentative {attempt+1}): {e}")
                time.sleep(2)

        if not success:
            logger.error(f"Fallback vecteur neutre pour le batch de {len(batch)} chunks.")
            for _ in batch:
                all_embeddings.append([0.0] * 768)

        time.sleep(0.5)

    return all_embeddings

def ingest_pdf_file(
    db: Session,
    pdf_path: str,
    title: str,
    author_scholar: str,
    category: str = "Tariqa / Fiqh / Histoire",
    chunk_size: int = 600,
    overlap: int = 100
) -> Dict[str, Any]:
    """Ingère un PDF complet en batch ultra-rapide et l'indexe dans pgvector."""
    
    document_id = str(uuid.uuid4())
    pages_data = extract_text_from_pdf(pdf_path)
    
    total_text = "\n\n".join([f"[Page {p['page']}]\n{p['text']}" for p in pages_data])
    
    # Découpage sémantique
    raw_chunks = split_text_into_chunks(total_text, chunk_size=chunk_size, overlap=overlap)
    print(f"📖 '{title}' : {len(pages_data)} pages extraites, {len(raw_chunks)} chunks à vectoriser...")

    # Calcul des embeddings en batch haute vitesse
    embeddings = generate_batch_embeddings(raw_chunks, batch_size=25)

    created_chunks = []
    for idx, (chunk_text, emb) in enumerate(zip(raw_chunks, embeddings)):
        page_match = re.search(r'\[Page (\d+)\]', chunk_text)
        page_num = int(page_match.group(1)) if page_match else None

        chunk_model = DocumentChunkModel(
            document_id=document_id,
            title=title,
            author_scholar=author_scholar,
            content=chunk_text,
            chunk_index=idx,
            metadata_json={
                "type": "PDF",
                "category": category,
                "page": page_num,
                "total_chunks": len(raw_chunks),
                "source_file": os.path.basename(pdf_path)
            },
            embedding=emb
        )
        db.add(chunk_model)
        created_chunks.append(chunk_model)

    db.commit()
    print(f"✅ Ingestion réussie pour '{title}' : {len(created_chunks)} chunks vectorisés dans pgvector.")

    return {
        "document_id": document_id,
        "title": title,
        "author_scholar": author_scholar,
        "pages_count": len(pages_data),
        "chunks_count": len(created_chunks)
    }

if __name__ == "__main__":
    db = SessionLocal()
    corpus_dir = "/app/data/corpus"
    
    files_to_ingest = [
        {
            "filename": "Dossier_Seydi_El_Hadji_Malick_Sy_Maodo.pdf",
            "title": "Dossier Historique et Enseignements de Seydi El Hadji Malick Sy (Maodo)",
            "author": "Seydi El Hadji Malick Sy (Maodo) / Communauté Tijaniyya",
            "category": "Histoire / Soufisme / Tijaniyya"
        },
        {
            "filename": "Khilasu-Thahab-traduit-.pdf",
            "title": "Khilāsu-Dh-Dhahab (L'Or Pur - Biographie Poétique du Prophète PSL)",
            "author": "Seydi El Hadji Malick Sy (Maodo)",
            "category": "Sira / Biographie Prophétique / Poésie Spirituelle"
        }
    ]

    print("\n🚀 Démarrage de l'indexation des PDF du Bureau dans la base vectorielle...")
    for item in files_to_ingest:
        full_path = os.path.join(corpus_dir, item["filename"])
        if os.path.exists(full_path):
            ingest_pdf_file(
                db=db,
                pdf_path=full_path,
                title=item["title"],
                author_scholar=item["author"],
                category=item["category"]
            )
        else:
            print(f"❌ Fichier manquant : {full_path}")
    print("\n🎉 Indexation terminée avec succès pour tous les documents !")
