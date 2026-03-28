from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

INVESTMENT_TYPE_RETURNS = {
    "FD":     0.070,
    "PPF":    0.071,
    "Gold":   0.080,
    "NPS":    0.100,
    "MF":     0.120,
    "Stocks": 0.150,
}

class InvestmentInput(BaseModel):
    type: str # 'stock' | 'mutual_fund'
    name: str
    symbol: Optional[str] = None
    amount: float

class InvestmentOutput(BaseModel):
    type: str
    name: str
    symbol: Optional[str] = None
    amount: float
    current_price: Optional[float] = None
    projected_value: float

class CalculateInvestmentRequest(BaseModel):
    investments: List[InvestmentInput]
    years: int
    risk_level: str
    
class CalculateInvestmentResponse(BaseModel):
    investments: List[InvestmentOutput]
    total_projected_value: float

class GoalCreateRequest(BaseModel):
    user_id: str
    goal_name: str
    years: int
    target_amount: float
    invest_amount: float = 0.0          # monthly SIP user is ready to invest
    expected_return_pct: float = 12.0   # user's expected annual return %
    investment_type: str = "MF"         # FD, MF, Stocks, PPF, Gold, NPS
    investments: Optional[List[InvestmentInput]] = []

class TypeComparisonEntry(BaseModel):
    rate_pct: float
    months_to_achieve: float
    years_to_achieve: float
    projected_value_at_goal_years: float

class GoalResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    goal_name: str
    years: int
    target_amount: float
    invest_amount: float = 0.0
    expected_return_pct: float = 12.0
    investment_type: str = "MF"
    risk_level: str
    expected_return: float
    inflation_adjusted_value: float
    monthly_sip: float
    months_to_achieve: float = 0.0
    achievement_date: Optional[str] = None
    start_date: Optional[str] = None
    type_comparison: Dict[str, Any] = {}
    investments: List[InvestmentOutput] = []
    created_at: datetime
    
    class Config:
        populate_by_name = True
