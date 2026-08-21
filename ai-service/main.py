import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import rag_router, ingest_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ai-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Démarrage du microservice IA CEZAT...")
    init_db()
    yield
    logger.info("Arrêt du microservice IA CEZAT.")

app = FastAPI(
    title="CEZAT AI Service (RAG & Érudits)",
    description="Microservice IA pour le RAG certifié, compréhension Wolof/Français et base vectorielle pgvector",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag_router.router)
app.include_router(ingest_router.router)

@app.get("/health", tags=["Santé"])
def health_check():
    return {"status": "ok", "service": "cezat-ai-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
