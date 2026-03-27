from pydantic import BaseModel
from typing import Dict

class MarketResponse(BaseModel):
    market_trend: str
    nifty_change: float
    sensex_change: float
    sector_signals: Dict[str, str]
    ai_summary: str
    suggestion: str
    market_context: str
