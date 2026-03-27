from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from fastapi import BackgroundTasks

# Create a global MongoDB client
# This client handles its own connection pooling and is safe to be used globally
try:
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client.wealth_ai
    goals_collection = db.goals
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    # You might want to handle this gracefully in a production system.
    db = None
    goals_collection = None
