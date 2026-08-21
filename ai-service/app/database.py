from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
import logging

logger = logging.getLogger(__name__)

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    try:
        with engine.connect() as conn:
            # Activation de l'extension pgvector
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            conn.commit()
            logger.info("Extension pgvector activée avec succès.")
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation de la base de données: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
