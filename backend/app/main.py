from fastapi import FastAPI
from app.chatbotfolder.chat import router as chat_router

app = FastAPI(
    title="AI Chatbot Backend",
    description="FastAPI backend for an AI chatbot using Groq API",
    version="1.0.0"
)

# Include API routes
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "Welcome to the AI Chatbot Backend! Send a POST request to /chat."}
