from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.domains.paperwork.models import PaperworkItem
from app.domains.paperwork.schemas import PaperworkItemOut

router = APIRouter(prefix="/api/paperwork", tags=["paperwork"])

# Ordered the way a student actually hits them, which is how the UI groups them.
PHASES = ["before_arrival", "first_10_days", "first_semester", "ongoing", "employment"]


@router.get("", response_model=list[PaperworkItemOut])
def list_paperwork(phase: str | None = None, db: Session = Depends(get_db)):
    stmt = select(PaperworkItem).options(joinedload(PaperworkItem.contact))
    if phase:
        stmt = stmt.where(PaperworkItem.phase == phase)
    items = db.execute(stmt).scalars().all()
    return sorted(
        items,
        key=lambda i: (PHASES.index(i.phase) if i.phase in PHASES else len(PHASES), i.position),
    )


@router.get("/{item_id}", response_model=PaperworkItemOut)
def get_paperwork_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(PaperworkItem, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Paperwork item not found")
    return item
