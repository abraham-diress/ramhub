from datetime import date

from sqlalchemy import JSON, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.domains.contacts.models import Contact


class PaperworkItem(Base):
    __tablename__ = "paperwork_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    applies_to: Mapped[str] = mapped_column(String(200))

    # Which stage of the journey this belongs to, and where it sorts inside that stage.
    phase: Mapped[str] = mapped_column(String(40), default="first_semester", index=True)
    position: Mapped[int] = mapped_column(default=0)

    deadline_date: Mapped[date | None] = mapped_column(nullable=True)
    deadline_note: Mapped[str | None] = mapped_column(String(300), nullable=True)
    steps: Mapped[list[str]] = mapped_column(JSON, default=list)

    # A missed deadline here costs status or money, so these surface first in the UI.
    is_critical: Mapped[bool] = mapped_column(default=False)

    external_link: Mapped[str | None] = mapped_column(String(500), nullable=True)
    source_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    source_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    last_verified: Mapped[date | None] = mapped_column(nullable=True)

    contact_id: Mapped[int | None] = mapped_column(ForeignKey("contacts.id"), nullable=True)
    contact: Mapped[Contact | None] = relationship()
