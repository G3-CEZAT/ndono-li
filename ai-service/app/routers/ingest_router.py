from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import DocumentChunkModel
from app.ingestion.chunker import split_text_into_chunks, generate_embedding

router = APIRouter(prefix="/ingest", tags=["Ingestion & Vectorstore"])

class DocumentIngestRequest(BaseModel):
    documentId: str
    title: str
    authorScholar: str
    content: str
    type: Optional[str] = "TEXT"

def verify_internal_secret(x_internal_secret: Optional[str] = Header(None)):
    if settings.INTERNAL_AI_SECRET and x_internal_secret != settings.INTERNAL_AI_SECRET:
        raise HTTPException(status_code=403, detail="Accès non autorisé au microservice IA")

@router.post("/document")
def ingest_document(
    request: DocumentIngestRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_internal_secret)
):
    """Découpe le document validé par l'érudit et l'indexe dans la base vectorielle pgvector."""
    
    # Supprimer les anciens chunks associés à ce document_id s'il s'agit d'une mise à jour
    db.query(DocumentChunkModel).filter(DocumentChunkModel.document_id == request.documentId).delete()
    
    # Découpage du texte en morceaux pertinents
    chunks = split_text_into_chunks(request.content, chunk_size=700, overlap=100)
    
    created_chunks = []
    for idx, chunk_text in enumerate(chunks):
        embedding_vec = generate_embedding(chunk_text)
        chunk_model = DocumentChunkModel(
            document_id=request.documentId,
            title=request.title,
            author_scholar=request.authorScholar,
            content=chunk_text,
            chunk_index=idx,
            metadata_json={"type": request.type, "total_chunks": len(chunks)},
            embedding=embedding_vec
        )
        db.add(chunk_model)
        created_chunks.append(chunk_model)
        
    db.commit()
    
    return {
        "success": True,
        "message": f"Document '{request.title}' indexé avec succès.",
        "documentId": request.documentId,
        "chunksCount": len(chunks)
    }
