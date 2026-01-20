import time
import httpx
from typing import Tuple

class OllamaClient:
    def __init__(
        self,
        model: str = "mistral",
        base_url: str = "http://localhost:11434",
        timeout: int = 120
    ):
        self.model = model
        self.base_url = base_url
        self.timeout = timeout

    async def generate(self, system_prompt: str, user_message: str) -> Tuple[str, int]:
        start = time.time()

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "stream": False
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json=payload
            )

            if response.status_code != 200:
                raise RuntimeError(response.text)

            data = response.json()

        latency_ms = int((time.time() - start) * 1000)

        return data["message"]["content"], latency_ms
