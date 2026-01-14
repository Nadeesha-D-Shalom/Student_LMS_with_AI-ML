from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.llm.ollama_client import OllamaClient
from app.llm.prompt_builder import build_system_prompt

router = APIRouter()
ollama = OllamaClient()


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # ---------- VALIDATION ----------
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    # ---------- BUILD SYSTEM PROMPT ----------
    system_prompt = build_system_prompt(
        user_message=req.message,
        grade=req.grade,
        subject=req.subject
    )

    try:
        answer, latency = await ollama.generate(system_prompt, req.message)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    return ChatResponse(
        answer_markdown=answer,
        followups=[
            "Do you want examples?",
            "Should I simplify this?",
            "Do you want exam questions?"
        ],
        confidence="medium",
        model=ollama.model,
        latency_ms=latency
    )
