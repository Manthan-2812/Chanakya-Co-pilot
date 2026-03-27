import asyncio
import yfinance as yf
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.goals.goal_schema import GoalCreateRequest, InvestmentInput

def fetch_stock_price(symbol: str) -> float | None: # Helper function to run in a thread
    """
    Downloads the current price of a ticker using yfinance.
    We run this synchronously in another thread so it doesn't block the FastAPI event loop.
    """
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period="1d")
        if not history.empty:
            return float(history["Close"].iloc[-1])
    except Exception:
        pass
    return None

async def calculate_investments_projection(investments: List[InvestmentInput], years: int, risk_level: str, overall_expected_return: float) -> tuple[List[Dict[str, Any]], float]:
    """
    Process investments by grabbing current prices (if stock) and estimating compounding growth.
    """
    output_investments = []
    total_projected_value = 0.0
    
    # Mock returns per the user's mutual fund spec
    mf_returns = {
        "Low": 0.06,
        "Medium": 0.10,
        "High": 0.12
    }
    
    for inv in investments:
        item = {
            "type": inv.type,
            "name": inv.name,
            "symbol": inv.symbol,
            "amount": inv.amount,
            "current_price": None,
            "projected_value": 0.0
        }
        
        if inv.type == "stock":            
            if inv.symbol:
                # Use to_thread since yfinance blocks IO
                price = await asyncio.to_thread(fetch_stock_price, inv.symbol)
                item["current_price"] = price if price else None
                
            # Estimate growth using expected_return
            proj_val = float(inv.amount) * ((1 + overall_expected_return) ** years)
            item["projected_value"] = round(proj_val, 2)
            
        elif inv.type == "mutual_fund":
            # Mutual funds use specific mock returns
            mf_ret = mf_returns.get(risk_level, 0.10)
            proj_val = float(inv.amount) * ((1 + mf_ret) ** years)
            item["projected_value"] = round(proj_val, 2)
            
        total_projected_value += item["projected_value"]
        output_investments.append(item)
        
    return output_investments, total_projected_value

async def calculate_goal_metrics(request: GoalCreateRequest) -> dict:
    years = request.years
    target_amount = request.target_amount
    
    # 1. Risk Calculation
    if years < 3:
        risk_level = "Low"
    elif 3 <= years <= 7:
        risk_level = "Medium"
    else:
        risk_level = "High"
        
    # 2. Expected Return Calculation
    if risk_level == "Low":
        expected_return = 0.06
    elif risk_level == "Medium":
        expected_return = 0.10
    else:  # High
        expected_return = 0.14
        
    # 3. Inflation Calculation
    inflation_rate = 0.06
    inflation_adjusted_value = target_amount * ( (1 + inflation_rate) ** years )
    
    # 4. Monthly SIP Calculation (Standard Formula)
    r = expected_return / 12
    n = years * 12
    
    if r > 0 and n > 0:
        monthly_sip = inflation_adjusted_value * r / (((1 + r) ** n) - 1)
    else:
        monthly_sip = inflation_adjusted_value
        
    # 5. Handle Investments Extension
    processed_investments = []
    if request.investments and len(request.investments) > 0:
        processed_investments, _ = await calculate_investments_projection(
            request.investments, years, risk_level, expected_return
        )
        
    return {
        "user_id": request.user_id,
        "goal_name": request.goal_name,
        "years": years,
        "target_amount": target_amount,
        "risk_level": risk_level,
        "expected_return": expected_return,
        "inflation_adjusted_value": round(inflation_adjusted_value, 2),
        "monthly_sip": round(monthly_sip, 2),
        "investments": processed_investments,  # newly populated investment array
        "created_at": datetime.now(timezone.utc)
    }
