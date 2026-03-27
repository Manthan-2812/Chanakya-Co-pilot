from app.goals.db import goals_collection
from app.portfolio.portfolio_repository import portfolio_repo
from app.market.market_service import analyze_market

class SummaryRepository:
    """
    Simulates a unified database controller explicitly for Summary calculations.
    Later, this can be swapped entirely with strict MongoDB Aggregation Pipelines!
    """

    async def get_user_goals(self, user_id: str):
        # We hook into the existing Motor pipeline for Goals securely returning fallback arrays if offline
        if goals_collection is None:
            return []
        try:
            cursor = goals_collection.find({"user_id": user_id})
            return await cursor.to_list(length=100)
        except Exception as e:
            print(f"MongoDB Offline Fallback triggered: {e}")
            return []

    async def get_user_portfolio(self, user_id: str):
        # We hook into the mocked Memory pipeline for Portfolios
        return await portfolio_repo.get_by_user(user_id)

    async def get_market_data(self):
        # Dynamically pulls fresh market data
        return await analyze_market()

# Singleton logic mapping exactly to clean architecture rules
summary_repo = SummaryRepository()
