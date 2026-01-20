from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.llm.ollama_client import OllamaClient
from app.llm.prompt_builder import build_system_prompt

router = APIRouter()
ollama = OllamaClient()


from app.core.llm_limiter import LLM_SEMAPHORE

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    system_prompt = build_system_prompt(
        user_message=req.message,
        grade=req.grade,
        subject=req.subject,
        language=req.language
    )

    try:
        async with LLM_SEMAPHORE:
            answer, latency = await ollama.generate(system_prompt, req.message)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    return ChatResponse(
        answer_markdown=answer,
        followups=[],
        confidence="medium",
        model=ollama.model,
        latency_ms=latency
    )
