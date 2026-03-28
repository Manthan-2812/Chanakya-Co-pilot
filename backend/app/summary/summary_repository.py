from app.goals.db import goals_repo
from app.portfolio.portfolio_repository import portfolio_repo
from app.market.market_service import analyze_market

class SummaryRepository:

    async def get_user_goals(self, user_id: str):
        try:
            return await goals_repo.find_by_user(user_id)
        except Exception:
            return []

    async def get_user_portfolio(self, user_id: str):
        # We hook into the mocked Memory pipeline for Portfolios
        return await portfolio_repo.get_by_user(user_id)

    async def get_market_data(self):
        # Dynamically pulls fresh market data
        return await analyze_market()

# Singleton logic mapping exactly to clean architecture rules
summary_repo = SummaryRepository()
