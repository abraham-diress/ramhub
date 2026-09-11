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
