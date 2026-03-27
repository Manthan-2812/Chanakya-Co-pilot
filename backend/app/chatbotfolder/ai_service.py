import requests
from app.config import settings
from fastapi import HTTPException

def get_ai_response(user_message: str) -> str:
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
                "content": "You are a helpful AI assistant"
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
