import json
import asyncio
import requests
from app.config import settings

def _call_gemini_api(prompt: str) -> dict:
    key = settings.GEMINI_API_KEY
    if not key or key == "your_gemini_api_key_here":
        raise ValueError("Missing Gemini API Key natively.")
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
    response.raise_for_status()
    
    data = response.json()
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        # Strip potential markdown output block
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        raise ValueError(f"Failed to parse Gemini output: {str(e)}")

async def generate_market_insight(data: dict) -> dict:
    """
    Sends market summaries to Gemini AI for an expert structural breakdown via prompt formatting.
    We enforce JSON output via prompting.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        return {
            "ai_summary": "Please configure your GEMINI_API_KEY in the .env file to view AI summaries.",
            "suggestion": "Configure API key.",
            "market_context": f"NIFTY {'Bullish' if data['nifty_change'] > 0 else 'Bearish'}."
        }

    prompt = f"""
You are a financial advisor for Indian investors.

Market data:
- NIFTY change: {data['nifty_change']}%
- SENSEX change: {data['sensex_change']}%
- Sector signals: {data['sector_signals']}

Provide:
1. Market sentiment summary
2. Simple investment advice
Keep it concise and beginner-friendly.

Return your response strictly in the following JSON format ONLY:
{{
  "ai_summary": "string describing market sentiment",
  "suggestion": "string with short investment advice",
  "market_context": "a short one-sentence summary string"
}}
"""

    try:
        # Avoid blocking FastAPI's thread securely
        parsed = await asyncio.to_thread(_call_gemini_api, prompt)
        return {
            "ai_summary": parsed.get("ai_summary", "No summary provided."),
            "suggestion": parsed.get("suggestion", "No suggestion provided."),
            "market_context": parsed.get("market_context", "No context provided.")
        }
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "ai_summary": "Unable to fetch AI summary right now due to networking or API errors.",
            "suggestion": "Please check your system connection boundaries.",
            "market_context": "Offline mode triggered automatically natively."
        }
