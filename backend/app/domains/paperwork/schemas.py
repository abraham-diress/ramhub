from datetime import date

from pydantic import BaseModel, ConfigDict

from app.domains.contacts.schemas import ContactOut


class PaperworkItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    applies_to: str
    phase: str
    deadline_date: date | None
    deadline_note: str | None
    steps: list[str]
    is_critical: bool
    external_link: str | None
    source_name: str | None
    source_url: str | None
    last_verified: date | None
    contact: ContactOut | None
