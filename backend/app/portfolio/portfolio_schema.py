from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Asset(BaseModel):
    type: str  # "stock" | "mutual_fund"
    name: str
    symbol: Optional[str] = None
    quantity: float
    buy_price: float

class PortfolioCreate(BaseModel):
    user_id: str
    assets: List[Asset]

class PortfolioResponse(BaseModel):
    total_value: float
    total_investment: float
    profit_loss: float
    allocation: Dict[str, float]
    line_chart: List[Dict[str, Any]]
    bar_chart: Dict[str, float]
    candlestick: Dict[str, Any]
