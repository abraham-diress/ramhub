from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Submission
from app.schemas import SubmissionCreate, SubmissionOut

router = APIRouter(prefix="/api/submissions", tags=["submissions"])


@router.post("", response_model=SubmissionOut, status_code=201)
def create_submission(payload: SubmissionCreate, db: Session = Depends(get_db)):
    submission = Submission(**payload.model_dump())
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission
