import requests
import os
from shared import config

api_key = config.settings.OPENROUTER_API_KEY
print("API KEY:", api_key)
resp = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"model": "anthropic/claude-3.5-sonnet", "messages": [{"role": "user", "content": "hi"}]}
)
print("STATUS:", resp.status_code)
print("BODY:", resp.text)
