from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.deps import get_current_user
from app.domains.auth.models import User
from app.domains.boards.models import Board, BoardColumn, Card
from app.domains.boards.schemas import (
    BoardCreate,
    BoardDetailOut,
    BoardOut,
    CardCreate,
    CardOut,
    CardUpdate,
    ColumnCreate,
    ColumnOut,
    ColumnUpdate,
)

router = APIRouter(prefix="/api/boards", tags=["boards"])

DEFAULT_COLUMNS = ["To Do", "In Progress", "Done"]


def _get_owned_board(db: Session, board_id: int, user: User, *, with_columns: bool = False) -> Board:
    stmt = select(Board).where(Board.id == board_id, Board.owner_id == user.id)
    if with_columns:
        stmt = stmt.options(selectinload(Board.columns).selectinload(BoardColumn.cards))
    board = db.execute(stmt).scalar_one_or_none()
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


def _get_owned_column(db: Session, column_id: int, user: User) -> BoardColumn:
    stmt = (
        select(BoardColumn)
        .join(Board, BoardColumn.board_id == Board.id)
        .where(BoardColumn.id == column_id, Board.owner_id == user.id)
    )
    column = db.execute(stmt).scalar_one_or_none()
    if column is None:
        raise HTTPException(status_code=404, detail="Column not found")
    return column


def _get_owned_card(db: Session, card_id: int, user: User) -> Card:
    stmt = (
        select(Card)
        .join(BoardColumn, Card.column_id == BoardColumn.id)
        .join(Board, BoardColumn.board_id == Board.id)
        .where(Card.id == card_id, Board.owner_id == user.id)
    )
    card = db.execute(stmt).scalar_one_or_none()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@router.get("", response_model=list[BoardOut])
def list_boards(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    stmt = select(Board).where(Board.owner_id == user.id).order_by(Board.created_at)
    return db.execute(stmt).scalars().all()


@router.post("", response_model=BoardDetailOut, status_code=201)
def create_board(payload: BoardCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    board = Board(title=payload.title, owner_id=user.id)
    board.columns = [BoardColumn(title=title, position=i) for i, title in enumerate(DEFAULT_COLUMNS)]
    db.add(board)
    db.commit()
    return _get_owned_board(db, board.id, user, with_columns=True)


@router.get("/{board_id}", response_model=BoardDetailOut)
def get_board(board_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _get_owned_board(db, board_id, user, with_columns=True)


@router.delete("/{board_id}", status_code=204)
def delete_board(board_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    board = _get_owned_board(db, board_id, user)
    db.delete(board)
    db.commit()


@router.post("/{board_id}/columns", response_model=ColumnOut, status_code=201)
def create_column(
    board_id: int, payload: ColumnCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    board = _get_owned_board(db, board_id, user, with_columns=True)
    position = len(board.columns)
    column = BoardColumn(board_id=board.id, title=payload.title, position=position)
    db.add(column)
    db.commit()
    db.refresh(column)
    return column


@router.patch("/columns/{column_id}", response_model=ColumnOut)
def update_column(
    column_id: int, payload: ColumnUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    column = _get_owned_column(db, column_id, user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(column, field, value)
    db.commit()
    db.refresh(column)
    return column


@router.delete("/columns/{column_id}", status_code=204)
def delete_column(column_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    column = _get_owned_column(db, column_id, user)
    db.delete(column)
    db.commit()


@router.post("/columns/{column_id}/cards", response_model=CardOut, status_code=201)
def create_card(
    column_id: int, payload: CardCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    column = _get_owned_column(db, column_id, user)
    position = len(column.cards)
    card = Card(column_id=column.id, position=position, **payload.model_dump())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.patch("/cards/{card_id}", response_model=CardOut)
def update_card(
    card_id: int, payload: CardUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    card = _get_owned_card(db, card_id, user)
    if payload.column_id is not None:
        _get_owned_column(db, payload.column_id, user)  # verify target column ownership
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    card = _get_owned_card(db, card_id, user)
    db.delete(card)
    db.commit()
