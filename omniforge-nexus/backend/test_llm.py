import asyncio
import traceback
import sys
import os

# Set working directory essentially 
# Import the openrouter 
from shared import openrouter

async def test_llm():
    try:
        response = await openrouter.llm.complete(
            messages=[{"role": "user", "content": "You are a lead system architect. Plan a structure for a todo app. Send valid json list of file paths."}],
            model="anthropic/claude-3.5-sonnet"
        )
        print("SUCCESS:")
        print(response.content)
    except Exception as e:
        import tenacity
        print("ERROR:", type(e), e)
        if isinstance(e, tenacity.RetryError):
            e = e.last_attempt.exception()
            print("Underlying ERROR:", type(e), e)
        if hasattr(e, 'response') and e.response is not None:
            print("RESPONSE TEXT:", e.response.text)

if __name__ == "__main__":
    asyncio.run(test_llm())
