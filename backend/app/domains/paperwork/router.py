from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.domains.paperwork.models import PaperworkItem
from app.domains.paperwork.schemas import PaperworkItemOut

router = APIRouter(prefix="/api/paperwork", tags=["paperwork"])


@router.get("", response_model=list[PaperworkItemOut])
def list_paperwork(db: Session = Depends(get_db)):
    stmt = select(PaperworkItem).options(joinedload(PaperworkItem.contact)).order_by(
        PaperworkItem.deadline_date.is_(None), PaperworkItem.deadline_date
    )
    return db.execute(stmt).scalars().all()


@router.get("/{item_id}", response_model=PaperworkItemOut)
def get_paperwork_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(PaperworkItem, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Paperwork item not found")
    return item
