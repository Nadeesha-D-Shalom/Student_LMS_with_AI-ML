from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.llm.ollama_client import OllamaClient
from app.llm.prompt_builder import build_system_prompt

router = APIRouter()
ollama = OllamaClient()


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    prompt = build_system_prompt(req.grade, req.subject)

    try:
        answer, latency = await ollama.generate(prompt, req.message)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    return ChatResponse(
        answer_markdown=answer,
        followups=[
            "Do you want exam questions?",
            "Should I simplify this?",
            "Do you want examples?"
        ],
        confidence="medium",
        model=ollama.model,
        latency_ms=latency
    )
