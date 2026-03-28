import asyncio
import math
import yfinance as yf
from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta
from typing import List, Dict, Any
from app.goals.goal_schema import GoalCreateRequest, InvestmentInput, INVESTMENT_TYPE_RETURNS

def fetch_stock_price(symbol: str) -> float | None:
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period="1d")
        if not history.empty:
            return float(history["Close"].iloc[-1])
    except Exception:
        pass
    return None

def calc_months_to_achieve(inflation_adj_target: float, monthly_invest: float, annual_rate: float) -> float:
    """SIP future-value formula solved for n (months)."""
    if monthly_invest <= 0 or annual_rate <= 0:
        return 0.0
    r = annual_rate / 12
    inside = (inflation_adj_target * r / monthly_invest) + 1
    if inside <= 0:
        return 0.0
    return math.log(inside) / math.log(1 + r)

def build_type_comparison(inflation_adj_target: float, monthly_invest: float, years: int) -> dict:
    result = {}
    for inv_type, annual_rate in INVESTMENT_TYPE_RETURNS.items():
        months = calc_months_to_achieve(inflation_adj_target, monthly_invest, annual_rate)
        r = annual_rate / 12
        n = years * 12
        projected = monthly_invest * (((1 + r) ** n - 1) / r) * (1 + r) if r > 0 and monthly_invest > 0 else 0.0
        result[inv_type] = {
            "rate_pct": round(annual_rate * 100, 1),
            "months_to_achieve": round(months, 1),
            "years_to_achieve": round(months / 12, 2) if months > 0 else 0.0,
            "projected_value_at_goal_years": round(projected, 2),
        }
    return result

async def calculate_investments_projection(investments: List[InvestmentInput], years: int, risk_level: str, overall_expected_return: float) -> tuple[List[Dict[str, Any]], float]:
    output_investments = []
    total_projected_value = 0.0
    mf_returns = {"Low": 0.06, "Medium": 0.10, "High": 0.12}

    for inv in investments:
        item = {
            "type": inv.type, "name": inv.name, "symbol": inv.symbol,
            "amount": inv.amount, "current_price": None, "projected_value": 0.0
        }
        if inv.type == "stock":
            if inv.symbol:
                price = await asyncio.to_thread(fetch_stock_price, inv.symbol)
                item["current_price"] = price if price else None
            proj_val = float(inv.amount) * ((1 + overall_expected_return) ** years)
            item["projected_value"] = round(proj_val, 2)
        elif inv.type == "mutual_fund":
            mf_ret = mf_returns.get(risk_level, 0.10)
            proj_val = float(inv.amount) * ((1 + mf_ret) ** years)
            item["projected_value"] = round(proj_val, 2)
        total_projected_value += item["projected_value"]
        output_investments.append(item)

    return output_investments, total_projected_value

async def calculate_goal_metrics(request: GoalCreateRequest) -> dict:
    years = request.years
    target_amount = request.target_amount
    invest_amount = request.invest_amount
    expected_return_pct = request.expected_return_pct
    investment_type = request.investment_type

    # 1. Risk level from years
    if years < 3:
        risk_level = "Low"
    elif years <= 7:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # 2. Use user's expected return if provided, else type default
    user_rate = expected_return_pct / 100
    type_default = INVESTMENT_TYPE_RETURNS.get(investment_type, 0.12)
    expected_return = user_rate if user_rate > 0 else type_default

    # 3. Inflation-adjusted target (6% inflation)
    inflation_rate = 0.06
    inflation_adjusted_value = target_amount * ((1 + inflation_rate) ** years)

    # 4. Recommended monthly SIP (to hit inflation-adj target in given years)
    r = expected_return / 12
    n = years * 12
    if r > 0 and n > 0:
        monthly_sip = inflation_adjusted_value * r / (((1 + r) ** n) - 1)
    else:
        monthly_sip = inflation_adjusted_value / max(n, 1)

    # 5. Timeline based on user's actual invest_amount
    start_dt = datetime.now(timezone.utc)
    if invest_amount > 0:
        months_to_achieve = calc_months_to_achieve(inflation_adjusted_value, invest_amount, expected_return)
        try:
            achievement_dt = start_dt + relativedelta(months=int(math.ceil(months_to_achieve)))
        except Exception:
            achievement_dt = start_dt + timedelta(days=int(months_to_achieve * 30.44))
    else:
        months_to_achieve = n
        achievement_dt = start_dt + relativedelta(years=years)

    # 6. Investment type comparison
    type_comparison = build_type_comparison(inflation_adjusted_value, invest_amount, years)

    # 7. Process any attached investment items
    processed_investments = []
    if request.investments:
        processed_investments, _ = await calculate_investments_projection(
            request.investments, years, risk_level, expected_return
        )

    return {
        "user_id": request.user_id,
        "goal_name": request.goal_name,
        "years": years,
        "target_amount": target_amount,
        "invest_amount": invest_amount,
        "expected_return_pct": expected_return_pct,
        "investment_type": investment_type,
        "risk_level": risk_level,
        "expected_return": expected_return,
        "inflation_adjusted_value": round(inflation_adjusted_value, 2),
        "monthly_sip": round(monthly_sip, 2),
        "months_to_achieve": round(months_to_achieve, 1),
        "achievement_date": achievement_dt.strftime("%Y-%m-%d"),
        "start_date": start_dt.strftime("%Y-%m-%d"),
        "type_comparison": type_comparison,
        "investments": processed_investments,
        "created_at": start_dt,
    }
