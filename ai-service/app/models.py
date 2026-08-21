import uuid
from sqlalchemy import Column, String, Text, DateTime, JSON, Float
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.database import Base

class DocumentChunkModel(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    author_scholar = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    chunk_index = Column(Float, default=0)
    metadata_json = Column(JSON, nullable=True)
    # Gemini text-embedding-004 génère des vecteurs de dimension 768
    embedding = Column(Vector(768), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
