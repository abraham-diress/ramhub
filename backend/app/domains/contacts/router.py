from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.domains.contacts.models import Contact
from app.domains.contacts.schemas import ContactOut

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("", response_model=list[ContactOut])
def list_contacts(db: Session = Depends(get_db)):
    return db.execute(select(Contact).order_by(Contact.office)).scalars().all()
