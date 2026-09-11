from pydantic import BaseModel


class SearchResult(BaseModel):
    type: str
    id: int
    title: str
    snippet: str
