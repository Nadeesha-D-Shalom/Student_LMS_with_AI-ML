import time
import httpx

class OllamaClient:
    def __init__(
        self,
        model="mistral:latest",
        base_url="http://localhost:11434",
        timeout=180
    ):
        self.model = model
        self.base_url = base_url
        self.timeout = timeout

    async def generate(self, system_prompt: str, user_message: str):
        start = time.time()

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "stream": False,
            "options": {
                "num_predict": 800,
                "temperature": 0.3,
                "top_p": 0.9
            }
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json=payload
            )

        if response.status_code != 200:
            raise RuntimeError(response.text)

        data = response.json()
        latency = int((time.time() - start) * 1000)

        return data["message"]["content"], latency
