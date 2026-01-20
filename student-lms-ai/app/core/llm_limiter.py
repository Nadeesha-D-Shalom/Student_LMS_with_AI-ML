import asyncio

LLM_SEMAPHORE = asyncio.Semaphore(2)  # start with 1, increase carefully
