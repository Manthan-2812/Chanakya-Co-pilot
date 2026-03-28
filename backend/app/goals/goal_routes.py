from fastapi import APIRouter, HTTPException
from typing import List
from app.goals.goal_schema import (
    GoalCreateRequest,
    GoalResponse,
    CalculateInvestmentRequest,
    CalculateInvestmentResponse
)
from app.goals.goal_service import calculate_goal_metrics, calculate_investments_projection
from app.goals.db import goals_repo

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.get("/assets", response_model=List[dict])
async def get_investment_assets():
    return [
        { "type": "stock", "name": "TCS", "symbol": "TCS.NS" },
        { "type": "stock", "name": "Infosys", "symbol": "INFY.NS" },
        { "type": "stock", "name": "Reliance", "symbol": "RELIANCE.NS" },
        { "type": "stock", "name": "HDFC Bank", "symbol": "HDFCBANK.NS" },
        { "type": "mutual_fund", "name": "Axis Bluechip Fund" },
        { "type": "mutual_fund", "name": "SBI Small Cap Fund" },
        { "type": "mutual_fund", "name": "ICICI Prudential Technology Fund" }
    ]

@router.post("/calculate-investment", response_model=CalculateInvestmentResponse)
async def calculate_investment(request: CalculateInvestmentRequest):
    try:
        if request.risk_level == "Low":
            expected_return = 0.06
        elif request.risk_level == "Medium":
            expected_return = 0.10
        else:
            expected_return = 0.14

        investments, total = await calculate_investments_projection(
            request.investments, request.years, request.risk_level, expected_return
        )
        return CalculateInvestmentResponse(
            investments=investments,
            total_projected_value=round(total, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate investments: {str(e)}")

@router.post("/create", response_model=GoalResponse)
async def create_goal(request: GoalCreateRequest):
    try:
        goal_data = await calculate_goal_metrics(request)
        await goals_repo.insert_one(goal_data)
        return GoalResponse(**goal_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create goal: {str(e)}")

@router.get("/{user_id}", response_model=List[GoalResponse])
async def get_user_goals(user_id: str):
    try:
        goals_list = await goals_repo.find_by_user(user_id)
        return [GoalResponse(**g) for g in goals_list]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch goals: {str(e)}")

@router.delete("/{user_id}/{goal_id}")
async def delete_goal(user_id: str, goal_id: str):
    deleted = await goals_repo.delete_one(goal_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted"}

@router.patch("/{user_id}/{goal_id}/complete")
async def complete_goal(user_id: str, goal_id: str):
    done = await goals_repo.mark_complete(goal_id)
    if not done:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal marked complete"}
