from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    column_id: int
    title: str
    description: str | None
    due_date: datetime | None
    position: int


class CardCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None


class CardUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    column_id: int | None = None
    position: int | None = None


class ColumnOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    board_id: int
    title: str
    position: int
    cards: list[CardOut] = []


class ColumnCreate(BaseModel):
    title: str


class ColumnUpdate(BaseModel):
    title: str | None = None
    position: int | None = None


class BoardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    created_at: datetime


class BoardDetailOut(BoardOut):
    columns: list[ColumnOut] = []


class BoardCreate(BaseModel):
    title: str
