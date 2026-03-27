from fastapi import APIRouter
from app.chatbotfolder.chat_schema import ChatRequest, ChatResponse
from app.chatbotfolder.ai_service import get_ai_response

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Endpoint to interact with the AI chatbot.
    """
    ai_reply = get_ai_response(request.message)
    return ChatResponse(reply=ai_reply)
