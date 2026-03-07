import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv('omniforge-nexus/backend/.env')

async def test_stream():
    key = os.getenv('OPENROUTER_API_KEY')
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "google/gemini-flash-1.5",
        "messages": [{"role": "user", "content": "Write a 3 sentence story."}],
        "stream": True
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            async with client.stream("POST", url, headers=headers, json=payload) as resp:
                print(f"Status: {resp.status_code}")
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            print("\n[DONE]")
                            break
                        try:
                            j = json.loads(data)
                            content = j['choices'][0]['delta'].get('content', '')
                            print(content, end='', flush=True)
                        except:
                            pass
    except Exception as e:
        print(f"\nError: {e}")

if __name__ == "__main__":
    asyncio.run(test_stream())
