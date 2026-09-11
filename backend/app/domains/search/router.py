from fastapi import APIRouter, Depends
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.domains.contacts.models import Contact
from app.domains.courses.models import Course
from app.domains.paperwork.models import PaperworkItem
from app.domains.search.schemas import SearchResult

router = APIRouter(prefix="/api/search", tags=["search"])


def _snippet(text: str, limit: int = 160) -> str:
    return text if len(text) <= limit else text[:limit].rsplit(" ", 1)[0] + "..."


@router.get("", response_model=list[SearchResult])
def search(q: str, db: Session = Depends(get_db)):
    query = f"%{q}%"
    results: list[SearchResult] = []

    courses = db.execute(
        select(Course).where(or_(Course.title.ilike(query), Course.code.ilike(query), Course.description.ilike(query)))
    ).scalars().all()
    for c in courses:
        results.append(SearchResult(type="course", id=c.id, title=f"{c.code} — {c.title}", snippet=_snippet(c.description or c.title)))

    paperwork = db.execute(
        select(PaperworkItem).where(or_(PaperworkItem.title.ilike(query), PaperworkItem.description.ilike(query)))
    ).scalars().all()
    for p in paperwork:
        results.append(SearchResult(type="paperwork", id=p.id, title=p.title, snippet=_snippet(p.description)))

    contacts = db.execute(
        select(Contact).where(or_(Contact.name.ilike(query), Contact.role.ilike(query), Contact.reach_out_for.ilike(query)))
    ).scalars().all()
    for c in contacts:
        results.append(SearchResult(type="contact", id=c.id, title=f"{c.name} ({c.role})", snippet=_snippet(c.reach_out_for)))

    return results
