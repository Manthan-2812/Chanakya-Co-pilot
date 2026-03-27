from pydantic import BaseModel

class SummaryResponse(BaseModel):
    total_goals: int
    completed_goals: int
    overall_progress: float
    portfolio_value: float
    total_target: float
    gap: float
    goal_status: str
    risk_level: str
    ai_summary: str
    suggestions: str
