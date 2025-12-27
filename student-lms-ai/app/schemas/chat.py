from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    grade: Optional[str] = None
    subject: Optional[str] = None


class ChatResponse(BaseModel):
    answer_markdown: str
    followups: List[str]
    confidence: str
    model: str
    latency_ms: int
