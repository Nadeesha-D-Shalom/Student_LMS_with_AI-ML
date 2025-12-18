from pydantic import BaseModel
from typing import Optional, List


class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    type: str
    concept: Optional[str] = None
    grade: Optional[int] = None
    subject: Optional[str] = None
    marks: Optional[int] = None
    points: Optional[List[str]] = None
    text: Optional[str] = None
