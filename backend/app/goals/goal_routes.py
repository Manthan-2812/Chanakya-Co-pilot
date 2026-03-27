from fastapi import APIRouter, HTTPException
from typing import List
from app.goals.goal_schema import (
    GoalCreateRequest, 
    GoalResponse, 
    CalculateInvestmentRequest, 
    CalculateInvestmentResponse
)
from app.goals.goal_service import calculate_goal_metrics, calculate_investments_projection
from app.goals.db import goals_collection
from bson import ObjectId

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.get("/assets", response_model=List[dict])
async def get_investment_assets():
    """
    Returns a static list of Indian assets suitable for MVP testing.
    """
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
    """
    Calculates projected values for given standalone investments using our 
    financial growth engine. Useful for live calculators!
    """
    try:
        # Resolve risk expected return mapping specifically for this calculation explicitly if needed, but
        # wait, the overall expected return logic relies on just mapping the risk level directly over.
        # Let's map it cleanly:
        if request.risk_level == "Low":
            expected_return = 0.06
        elif request.risk_level == "Medium":
            expected_return = 0.10
        else:
            expected_return = 0.14

        investments, total = await calculate_investments_projection(
            request.investments, 
            request.years, 
            request.risk_level, 
            expected_return
        )
        return CalculateInvestmentResponse(
            investments=investments,
            total_projected_value=round(total, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate investments: {str(e)}")

@router.post("/create", response_model=GoalResponse)
async def create_goal(request: GoalCreateRequest):
    """
    Endpoint to calculate goal metrics and store the goal with nested investments.
    """
    if goals_collection is None:
        raise HTTPException(status_code=500, detail="Database connection is not configured properly.")

    try:
        # 1. Calculate business logic values, including executing Async investments loop if necessary
        goal_data = await calculate_goal_metrics(request)
        
        # 2. Store in MongoDB
        result = await goals_collection.insert_one(goal_data)
        
        # 3. Add generated ObjectId as string to response dictionary
        goal_data["_id"] = str(result.inserted_id)
        
        return GoalResponse(**goal_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create goal: {str(e)}")

@router.get("/{user_id}", response_model=List[GoalResponse])
async def get_user_goals(user_id: str):
    """
    Fetch all goals belonging to a specific user_id.
    """
    if goals_collection is None:
        raise HTTPException(status_code=500, detail="Database connection is not configured properly.")

    try:
        # Fetching documents
        goals_cursor = goals_collection.find({"user_id": user_id})
        goals_list = await goals_cursor.to_list(length=100)
        
        # Pydantic's alias setup requires processing object ID to a string
        response_list = []
        for goal in goals_list:
            goal["_id"] = str(goal["_id"])
            response_list.append(GoalResponse(**goal))
            
        return response_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch goals: {str(e)}")
