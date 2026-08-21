from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
import json
from app.database import get_db
from app.config import settings
from app.rag.pipeline import run_rag_pipeline
from app.audio.processor import transcribe_audio_bytes

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
    transcription: Optional[str] = None

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

@router.post("/ask-voice", response_model=RagQueryResponse)
async def ask_voice_question(
    file: UploadFile = File(...),
    history: Optional[str] = Form(None),
    languagePreference: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    _: None = Depends(verify_internal_secret)
):
    """Reçoit une note vocale d'un pèlerin (Wolof ou FR), la transcrit et exécute le pipeline RAG certifié."""
    audio_bytes = await file.read()
    mime_type = file.content_type or "audio/mpeg"

    # Transcription de la question vocale
    transcription_result = transcribe_audio_bytes(audio_bytes, mime_type=mime_type)
    question_text = transcription_result["transcription"]
    detected_lang = transcription_result.get("detected_language", "fr")

    # Parsing de l'historique si fourni sous forme de chaîne JSON
    parsed_history = []
    if history:
        try:
            parsed_history = json.loads(history)
        except Exception:
            parsed_history = []

    # Exécution du RAG
    rag_result = run_rag_pipeline(
        db=db,
        question=question_text,
        history=parsed_history,
        language_preference=languagePreference or detected_lang
    )

    rag_result["transcription"] = question_text
    return rag_result
