from pydantic import BaseModel, ConfigDict


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
