from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Course
from app.schemas import CourseOut

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("", response_model=list[CourseOut])
def list_courses(program: str | None = None, db: Session = Depends(get_db)):
    stmt = select(Course)
    if program:
        stmt = stmt.where(Course.program == program)
    return db.execute(stmt.order_by(Course.code)).scalars().all()


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
