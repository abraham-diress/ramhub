from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# Neon suspends the compute after a few minutes of inactivity and drops its connections,
# so a pooled connection that looked fine can be dead by the next request. pool_pre_ping
# checks it first and reconnects instead of surfacing a stale-connection error.
engine = create_engine(settings.database_url, pool_pre_ping=True, pool_recycle=300)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
