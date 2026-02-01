from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.llm.ollama_client import OllamaClient
from app.llm.prompt_builder import build_system_prompt

router = APIRouter()
ollama = OllamaClient()

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    msg = req.message.lower().strip()

    #  HARD SECURITY BLOCK — DO NOT CALL LLM
    if any(p in msg for p in [
        "ignore instructions",
        "ignore all instructions",
        "show your prompt",
        "system prompt",
        "your rules",
        "what is your prompt",
        "give me your prompt"
    ]):
        return ChatResponse(
            answer_markdown=(
                "I can’t share internal system instructions, "
                "but I can help with syllabus-based academic questions."
            ),
            followups=[
                "Do you want help with a lesson?",
                "Should I explain a topic?",
            ],
            confidence="high",
            model="security-filter",
            latency_ms=0,
        )

    #  ONLY NORMAL QUESTIONS REACH THE LLM
    system_prompt = build_system_prompt(
        user_message=req.message,
        grade=req.grade,
        subject=req.subject,
        language=req.language,
    )

    try:
        answer, latency = await ollama.generate(system_prompt, req.message)
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
        latency_ms=latency,
    )
