from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# Engine: manages the actual connection pool to PostgreSQL
engine = create_engine(settings.DATABASE_URL)

# Session factory: each request gets its own DB session from this
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base class every model (User, Prescription, etc.) will inherit from
class Base(DeclarativeBase):
    pass


# Dependency function — FastAPI will call this per-request to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()