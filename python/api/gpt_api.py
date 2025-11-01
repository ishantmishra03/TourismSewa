import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))  # root path

import httpx, asyncio
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from config import API_KEY

app = FastAPI()


system_prompt = """
You are a travel guide for Nepal.
Respond in friendly readable format (no JSON). Include:
- City name
- Summary
- Weather
- Road conditions
- Up to 3 cultural sites
- Up to 2 trekking routes
- 2-3 advice points
Respond in same language as user input.
"""

async def get_response(user_input: str) -> dict:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    data = {
        "model": "gpt-4.1",
        "messages":[
            {"role":"system","content":system_prompt},
            {"role":"user","content":user_input}
        ],
        "temperature":0.3,
        "max_tokens":400
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            return {"text": content.strip()}

    except httpx.RequestError as e:
        print("🚨 Network error:", e)
        return {"error": "⚠️ Cannot reach GPT server. Please check your internet or try again later."}
    except httpx.HTTPStatusError as e:
        print("🚨 HTTP error:", e)
        return {"error": f"⚠️ GPT server returned HTTP {e.response.status_code}"}
    except Exception as e:
        print("🚨 Unexpected error:", e)
        return {"error": "⚠️ Backend error. Please try again later."}

# FastAPI endpoint
@app.post("/api/get_response")
async def api_get_response(request: Request):
    data = await request.json()
    user_input = data.get("user_input", "")
    if not user_input:
        return JSONResponse({"error": "No user_input provided"}, status_code=400)
    return await get_response(user_input)
