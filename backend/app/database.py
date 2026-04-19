from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Initialize engine and session maker
try:
    engine = create_engine(settings.DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(engine, expire_on_commit=False)
except Exception as e:
    logger.warning(f"Failed to initialize database engine: {e}. Database operations may not be available.")
    engine = None
    SessionLocal = None


class Base(DeclarativeBase):
    pass


def get_db() -> Session:
    if SessionLocal is None:
        raise RuntimeError("Database session maker not initialized")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    if engine is None:
        logger.warning("Database engine not initialized, skipping database initialization")
        return
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")