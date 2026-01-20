import json
from typing import AsyncGenerator

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.llm.ollama_client import OllamaClient
from app.llm.prompt_builder import build_system_prompt

router = APIRouter()
ollama = OllamaClient()


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


@router.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    system_prompt = build_system_prompt(
        user_message=req.message,
        grade=req.grade,
        subject=req.subject,
        language=req.language
    )

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            async for chunk in ollama.generate_stream(system_prompt, req.message):
                # SSE event "token"
                yield f"event: token\ndata: {json.dumps({'t': chunk})}\n\n"

            # SSE event "done"
            yield "event: done\ndata: {}\n\n"

        except Exception as e:
            # SSE event "error"
            yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
