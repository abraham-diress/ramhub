from pydantic import BaseModel, ConfigDict


class ContactOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    office: str
    category: str
    email: str | None
    phone: str | None
    website: str | None
    rose_hill_location: str | None
    lincoln_center_location: str | None
    reach_out_for: str
