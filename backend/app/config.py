import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your_api_key_here")
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    MODEL_NAME = "llama-3.1-8b-instant"
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority")

settings = Settings()
