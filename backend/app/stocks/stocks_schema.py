from pydantic import BaseModel
from typing import Optional, List

class StockPosition(BaseModel):
    symbol: str
    name: str
    quantity: float
    buy_price: float
    instrument_type: str = "Stock"  # Stock | Futures | Options

class StocksAddRequest(BaseModel):
    user_id: str
    positions: List[StockPosition]

class PositionResult(BaseModel):
    symbol: str
    name: str
    quantity: float
    buy_price: float
    instrument_type: str
    current_price: Optional[float] = None
    current_value: float
    invested_value: float
    pnl: float
    pnl_pct: float

class StocksResponse(BaseModel):
    user_id: str
    positions: List[PositionResult]
    total_invested: float
    total_current_value: float
    total_pnl: float
    total_pnl_pct: float
