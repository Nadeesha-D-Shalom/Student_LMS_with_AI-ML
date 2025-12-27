import time
import httpx
from app.core.config import settings


class OllamaClient:
    def __init__(self):
        self.base_url = settings.ollama_base_url.rstrip("/")
        self.model = settings.ollama_model
        self.temperature = settings.ollama_temperature
        self.timeout = settings.ollama_timeout_seconds

    async def generate(self, system_prompt: str, user_message: str):
        url = f"{self.base_url}/api/generate"

        prompt = f"{system_prompt}\n\nQuestion:\n{user_message}"

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": self.temperature
            }
        }

        start = time.perf_counter()
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

        latency_ms = int((time.perf_counter() - start) * 1000)
        text = data.get("response", "").strip()

        return text, latency_ms
