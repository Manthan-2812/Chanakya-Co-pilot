import requests
from app.config import settings
from fastapi import HTTPException

def get_ai_response(user_message: str, user_context: str = "") -> str:
    """
    Sends the user message to the Groq API and returns the AI's response.
    """
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your_api_key_here":
        raise HTTPException(
            status_code=500, 
            detail="GROQ_API_KEY is not set. Please update your .env file."
        )

    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": settings.MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are Chanakya, an expert AI financial co-pilot for Indian investors. "
                    "You have deep expertise in: SIP planning, mutual funds, stocks, FD, PPF, NPS, gold, "
                    "inflation-adjusted goal planning, portfolio rebalancing, and tax-saving instruments. "
                    "\n\nYou are also a macro analyst who understands how global geopolitical events affect Indian markets. "
                    "When asked about events like the Iran-Israel war, Russia-Ukraine conflict, US Fed rate decisions, "
                    "oil price shocks, or any global crisis, you MUST explain: "
                    "(1) the direct market impact — which sectors/indices are affected and how, "
                    "(2) what it means for Indian investors specifically — crude oil import costs, rupee depreciation, "
                    "FII outflows, defence sector opportunities, etc., "
                    "(3) actionable portfolio advice — what to buy, sell, hedge, or hold. "
                    "\n\nAlways give concise, actionable responses. Use INR (₹) for monetary values. "
                    "Be direct and data-driven. Never refuse to answer a financial or market question. "
                    "If you don't have real-time data, reason from first principles and known market dynamics."
                    "\n\nIMPORTANT RULES FOR PERSONALISED ADVICE: "
                    "When user context is provided, ALWAYS base your advice on their ACTUAL goals, SIP amounts, "
                    "investment types, and time horizons. "
                    "For goals with horizon > 15 years, recommend minimum 80% equity allocation — NEVER suggest shifting to debt. "
                    "Flag underfunded goals (user SIP < recommended SIP). "
                    "Flag overfunded goals as ahead of schedule. "
                    "Always reference the user's specific goal names and numbers in your response."
                    + user_context
                )
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    }

    try:
        response = requests.post(settings.GROQ_API_URL, headers=headers, json=payload)
        response.raise_for_status() 
        data = response.json()
        
        # Extract the reply message
        return data["choices"][0]["message"]["content"]
    
    except requests.exceptions.RequestException as e:
        error_msg = str(e)
        if hasattr(e, 'response') and e.response is not None:
            error_msg += f" - {e.response.text}"
        raise HTTPException(status_code=500, detail=f"Groq API Error: {error_msg}")
    except (KeyError, IndexError):
        raise HTTPException(status_code=500, detail="Unexpected response format from Groq API")
