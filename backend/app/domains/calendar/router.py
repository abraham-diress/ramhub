from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.domains.auth.models import User
from app.domains.boards.models import Board, BoardColumn, Card
from app.domains.calendar.models import CalendarEvent
from app.domains.calendar.schemas import (
    CalendarEventCreate,
    CalendarEventOut,
    CalendarEventUpdate,
    CalendarItemOut,
)

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


def _get_owned_event(db: Session, event_id: int, user: User) -> CalendarEvent:
    event = db.execute(
        select(CalendarEvent).where(CalendarEvent.id == event_id, CalendarEvent.owner_id == user.id)
    ).scalar_one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.get("", response_model=list[CalendarItemOut])
def get_calendar(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    events = db.execute(select(CalendarEvent).where(CalendarEvent.owner_id == user.id)).scalars().all()
    items = [
        CalendarItemOut(
            type="event",
            id=e.id,
            title=e.title,
            description=e.description,
            start=e.start_time,
            end=e.end_time,
            all_day=e.all_day,
            editable=True,
        )
        for e in events
    ]

    cards = (
        db.execute(
            select(Card)
            .join(BoardColumn, Card.column_id == BoardColumn.id)
            .join(Board, BoardColumn.board_id == Board.id)
            .where(Board.owner_id == user.id, Card.due_date.is_not(None))
        )
        .scalars()
        .all()
    )
    items += [
        CalendarItemOut(
            type="task",
            id=c.id,
            title=c.title,
            description=c.description,
            start=c.due_date,
            end=None,
            all_day=True,
            editable=False,
        )
        for c in cards
    ]

    return items


@router.post("/events", response_model=CalendarEventOut, status_code=201)
def create_event(
    payload: CalendarEventCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    event = CalendarEvent(owner_id=user.id, **payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.patch("/events/{event_id}", response_model=CalendarEventOut)
def update_event(
    event_id: int,
    payload: CalendarEventUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    event = _get_owned_event(db, event_id, user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/events/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    event = _get_owned_event(db, event_id, user)
    db.delete(event)
    db.commit()
