from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.rag.pipeline import run_rag_pipeline

router = APIRouter(prefix="/rag", tags=["RAG Chatbot"])

class ChatMessageItem(BaseModel):
    sender: str
    content: str

class RagQueryRequest(BaseModel):
    question: str
    history: Optional[List[ChatMessageItem]] = []
    languagePreference: Optional[str] = None

class RagSourceItem(BaseModel):
    documentTitle: str
    authorScholar: str
    score: float
    chunkContent: str

class RagQueryResponse(BaseModel):
    answer: str
    isFound: bool
    sources: List[RagSourceItem]
    detectedLanguage: str

def verify_internal_secret(x_internal_secret: Optional[str] = Header(None)):
    if settings.INTERNAL_AI_SECRET and x_internal_secret != settings.INTERNAL_AI_SECRET:
        raise HTTPException(status_code=403, detail="Accès non autorisé au microservice IA")

@router.post("/ask", response_model=RagQueryResponse)
def ask_question(
    request: RagQueryRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_internal_secret)
):
    formatted_history = [{"sender": m.sender, "content": m.content} for m in (request.history or [])]
    result = run_rag_pipeline(
        db=db,
        question=request.question,
        history=formatted_history,
        language_preference=request.languagePreference
    )
    return result
