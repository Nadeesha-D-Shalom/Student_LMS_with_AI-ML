from fastapi import APIRouter
from app.models.schemas import AskRequest, AskResponse
from app.rag.generator import generate_answer
from app.rag.retriever import retrieve_context

router = APIRouter()

@router.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest):
    context = retrieve_context(request.question)
    answer = generate_answer(request.question, context)
    return AskResponse(**answer)
