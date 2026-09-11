from datetime import date

from pydantic import BaseModel, ConfigDict

from app.domains.contacts.schemas import ContactOut


class PaperworkItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    applies_to: str
    deadline_date: date | None
    deadline_note: str | None
    external_link: str | None
    contact: ContactOut | None
