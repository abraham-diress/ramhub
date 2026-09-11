from datetime import date

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PaperworkItem(Base):
    __tablename__ = "paperwork_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    applies_to: Mapped[str] = mapped_column(String(200))
    deadline_date: Mapped[date | None] = mapped_column(nullable=True)
    deadline_note: Mapped[str | None] = mapped_column(String(300), nullable=True)
    external_link: Mapped[str | None] = mapped_column(String(500), nullable=True)
    contact_id: Mapped[int | None] = mapped_column(ForeignKey("contacts.id"), nullable=True)

    contact: Mapped["Contact"] = relationship()
