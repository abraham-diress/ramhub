from datetime import datetime

from pydantic import BaseModel, ConfigDict


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
