from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class CalendarEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    start_time: datetime
    end_time: datetime | None
    all_day: bool


class CalendarEventCreate(BaseModel):
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime | None = None
    all_day: bool = False


class CalendarEventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    all_day: bool | None = None


class CalendarItemOut(BaseModel):
    """A unified view combining manually-created events and card due dates."""

    type: Literal["event", "task"]
    id: int
    title: str
    description: str | None
    start: datetime
    end: datetime | None
    all_day: bool
    editable: bool
