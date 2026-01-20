import time
import asyncio
import httpx


class OllamaClient:
    def __init__(self, model: str = "mistral"):
        self.model = model
        self.base_url = "http://127.0.0.1:11434"

    async def generate(self, system_prompt: str, user_prompt: str):
        start = time.time()

        payload = {
            "model": self.model,
            "prompt": user_prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "num_ctx": 2048,
                "num_predict": 256,
                "temperature": 0.2
            }
        }

        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            data = response.json()

        latency = int((time.time() - start) * 1000)
        return data["response"], latency
