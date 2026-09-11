from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ContactOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    office: str
    email: str | None
    phone: str | None
    reach_out_for: str


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    title: str
    program: str
    credits: int
    recommended_term: str | None
    description: str | None
    tips: str | None


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


class SubmissionCreate(BaseModel):
    category: str
    content: str
    submitter_email: str | None = None


class SubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    content: str
    status: str
    created_at: datetime


class SearchResult(BaseModel):
    type: str
    id: int
    title: str
    snippet: str
