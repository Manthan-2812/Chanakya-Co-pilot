class PortfolioRepository:
    def __init__(self):
        # In-memory storage acting as a mock database
        self.storage = []

    async def save(self, data: dict):
        """
        Saves raw user portfolio data into the temporary storage.
        """
        self.storage.append(data)
        return data

    async def get_by_user(self, user_id: str):
        """
        Retrieves all raw portfolio documents tied to a specific user.
        """
        return [p for p in self.storage if p.get("user_id") == user_id]

# Singleton instance exported for use in routes/services
portfolio_repo = PortfolioRepository()
