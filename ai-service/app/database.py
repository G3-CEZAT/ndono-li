from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
import logging

logger = logging.getLogger(__name__)

clean_db_url = settings.DATABASE_URL.split("?")[0] if "?" in settings.DATABASE_URL else settings.DATABASE_URL
engine = create_engine(
    clean_db_url,
    connect_args={"connect_timeout": 1},
    pool_pre_ping=False
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

_db_available = False

def init_db():
    global _db_available
    try:
        with engine.connect() as conn:
            # Activation de l'extension pgvector
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            conn.commit()
            logger.info("Extension pgvector activée avec succès.")
            _db_available = True
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        _db_available = False
        logger.warning(f"PostgreSQL/pgvector non disponible (mode corpus autonome actif): {e}")

def get_db():
    global _db_available
    if not _db_available:
        yield None
        return

    db = None
    try:
        db = SessionLocal()
        yield db
    except Exception:
        yield None
    finally:
        try:
            if db:
                db.close()
        except Exception:
            pass
