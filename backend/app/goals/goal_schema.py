from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

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
    investments: Optional[List[InvestmentInput]] = []

class GoalResponse(BaseModel):
    id: str = Field(alias="_id") # internal mongo _id maps properly to output id
    user_id: str
    goal_name: str
    years: int
    target_amount: float
    risk_level: str
    expected_return: float
    inflation_adjusted_value: float
    monthly_sip: float
    investments: List[InvestmentOutput] = []
    created_at: datetime
    
    class Config:
        populate_by_name = True
