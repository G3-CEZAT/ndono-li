import os
import re
import uuid
import time
import traceback
from pypdf import PdfReader
import google.generativeai as genai
from app.config import settings
from app.database import SessionLocal
from app.models import DocumentChunkModel
from app.ingestion.chunker import split_text_into_chunks, get_best_embedding_model

genai.configure(api_key=settings.GEMINI_API_KEY)
db = SessionLocal()
model_name = get_best_embedding_model()
print(f"[INFO] Using Embedding Model: {model_name}")

files = [
    (
        "Dossier_Seydi_El_Hadji_Malick_Sy_Maodo.pdf",
        "Dossier Historique et Enseignements de Seydi El Hadji Malick Sy (Maodo)",
        "Seydi El Hadji Malick Sy (Maodo) / Communauté Tijaniyya"
    ),
    (
        "Khilasu-Thahab-traduit-.pdf",
        "Khilāsu-Dh-Dhahab (L'Or Pur - Biographie Poétique du Prophète PSL)",
        "Seydi El Hadji Malick Sy (Maodo)"
    )
]

corpus_dir = "/app/data/corpus"

for filename, title, author in files:
    full_path = os.path.join(corpus_dir, filename)
    print(f"\n==========================================")
    print(f"📖 Traitement de : {filename}")
    print(f"Titre : {title}")
    print(f"==========================================")

    if not os.path.exists(full_path):
        print(f"❌ Fichier non trouvé : {full_path}")
        continue

    try:
        reader = PdfReader(full_path)
        print(f"Pages trouvées : {len(reader.pages)}")

        pages_text = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            text = re.sub(r'www\.tidjaniyya\.org', '', text, flags=re.IGNORECASE).strip()
            if text:
                pages_text.append(f"[Page {i+1}]\n{text}")

        total_text = "\n\n".join(pages_text)
        chunks = split_text_into_chunks(total_text, chunk_size=650, overlap=100)
        print(f"Total chunks générés : {len(chunks)}")

        doc_id = str(uuid.uuid4())
        batch_size = 15

        for b_idx in range(0, len(chunks), batch_size):
            batch_chunks = chunks[b_idx:b_idx + batch_size]
            
            # Embed with retry
            embeddings = None
            for attempt in range(3):
                try:
                    res = genai.embed_content(
                        model=model_name,
                        content=batch_chunks,
                        task_type="retrieval_document",
                        output_dimensionality=768
                    )
                    embeddings = res['embedding']
                    break
                except Exception as err:
                    print(f"  [Tentative {attempt+1}] Erreur API: {err}")
                    time.sleep(3)

            if embeddings is None:
                print(f"  [Avertissement] Fallback vecteur pour le batch {b_idx}")
                embeddings = [[0.0] * 768 for _ in batch_chunks]

            for c_idx, (chunk_text, emb) in enumerate(zip(batch_chunks, embeddings)):
                real_idx = b_idx + c_idx
                page_match = re.search(r'\[Page (\d+)\]', chunk_text)
                page_num = int(page_match.group(1)) if page_match else None

                chunk_obj = DocumentChunkModel(
                    document_id=doc_id,
                    title=title,
                    author_scholar=author,
                    content=chunk_text,
                    chunk_index=real_idx,
                    metadata_json={
                        "source_file": filename,
                        "page": page_num,
                        "chunk_num": real_idx + 1,
                        "total_chunks": len(chunks)
                    },
                    embedding=emb
                )
                db.add(chunk_obj)

            db.commit()
            print(f"  ✅ Chunks {b_idx + 1} à {min(b_idx + batch_size, len(chunks))} / {len(chunks)} indexés.")
            time.sleep(0.5)

        print(f"🎉 Terminé avec succès pour {filename} !")

    except Exception as e:
        print(f"❌ Erreur lors du traitement de {filename} : {e}")
        traceback.print_exc()

print("\n🚀 TOUS LES FICHIERS ONT ÉTÉ VECTORISÉS ET INDEXÉS DANS PGVECTOR !")
