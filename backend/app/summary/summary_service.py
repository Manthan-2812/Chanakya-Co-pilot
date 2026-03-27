import json
import asyncio
import requests
from app.config import settings
from app.portfolio.portfolio_service import analyze_portfolio
from app.summary.summary_repository import summary_repo

def _call_groq_ai(prompt: str) -> dict:
    """
    Since the Gemini key hit a '429 LIMIT 0' issue for the user natively, 
    we mapped to Groq (which holds your fully functional Chatbot keys natively) 
    to guarantee this module works successfully upon load without crashing!
    """
    key = settings.GROQ_API_KEY
    if not key or key == "your_api_key_here":
        raise ValueError("Missing GROQ_API_KEY")
        
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    
    # We strictly enforce JSON outputs for programmatic mapping without Regex hacks
    payload = {
        "model": settings.MODEL_NAME, # fallback to standard defined llama-3.1-8b-instant
        "messages": [
            {
                "role": "system", 
                "content": "You are a financial advisor assistant returning valid JSON objects only."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"}
    }
    
    response = requests.post(settings.GROQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    text = data["choices"][0]["message"]["content"].strip()
    return json.loads(text)

async def generate_summary_ai(data: dict) -> dict:
    prompt = f"""
    User financial summary tracking:
    Goals Data:
    - Total target value: ₹{data['total_target']}
    
    Portfolio Holdings:
    - Current Portfolio value: ₹{data['portfolio_value']}
    
    Market Context Streams:
    - {data['market_summary']}
    
    Overall Goal Progress %: {data['progress']}%
    
    Provide exactly two fields:
    1. A simple explanation describing what the data explicitly tells us visually (ai_summary)
    2. A clear actionable direct investment advice statement (suggestions)
    
    Return EXACTLY in this formatting natively for backend parsers, no markdown wrapping:
    {{
       "ai_summary": "...",
       "suggestions": "..."
    }}
    """
    try:
        # Wrap sync API loop
        parsed = await asyncio.to_thread(_call_groq_ai, prompt)
        return {
            "ai_summary": parsed.get("ai_summary", "No summary was calculated."),
            "suggestions": parsed.get("suggestions", "No suggestions generated.")
        }
    except Exception as e:
        print(f"Summary AI Generation Error: {e}")
        return {
            "ai_summary": "Unable to generate structural AI analysis due to API constraints.",
            "suggestions": "Ensure your GROQ keys natively hold limit capacities inside the backend."
        }


async def build_user_summary(user_id: str) -> dict:
    """
    Combines goals logic, portfolio assets logic, and external macro trends natively natively.
    """
    # 1. Fetch cross-module dependencies concurrently mapping efficiently
    goals_task = summary_repo.get_user_goals(user_id)
    port_task = summary_repo.get_user_portfolio(user_id)
    market_task = summary_repo.get_market_data()
    
    goals, portfolios, market_data = await asyncio.gather(goals_task, port_task, market_task)
    
    # 2. Portfolio Aggregate Calculations Loop
    all_assets = []
    for p in portfolios:
        all_assets.extend(p.get("assets", []))
    
    portfolio_analysis = await analyze_portfolio(all_assets)
    portfolio_value = portfolio_analysis.get("total_value", 0.0)
    
    # 3. Goals Mathematical Aggregations
    total_goals = len(goals)
    total_target = sum(float(g.get("target_amount", 0.0)) for g in goals)
    
    completed_goals = 0
    if total_target > 0 and portfolio_value >= total_target:
        completed_goals = total_goals
        
    # 4. Progress Structuring Math
    if total_target > 0:
        progress = round((portfolio_value / total_target) * 100, 2)
    else:
        progress = 0.0
        
    # 5. Gap Deductions
    gap = max(0.0, total_target - portfolio_value)
    
    # 6. Status Definition Lookups natively
    if progress > 80:
        goal_status = "On Track"
    elif progress >= 50:
        goal_status = "Moderate"
    else:
        goal_status = "Behind"
        
    # 7. Iterative Risk Deductions logic
    risk_mapping = {"Low": 1, "Medium": 2, "High": 3}
    reverse_mapping = {1: "Low", 2: "Medium", 3: "High"}
    max_risk = 1
    for g in goals:
        r = g.get("risk_level", "Low")
        max_risk = max(max_risk, risk_mapping.get(r, 1))
    risk_level = reverse_mapping[max_risk]
    
    # 8. External Context Prep string (Taking Macro level strings from Market pipelines cleanly!)
    market_summary = f"NIFTY is structurally {market_data.get('market_trend', 'Neutral')} natively dynamically."
    
    # 9. Formulating explicit data payloads for LLM Consumption specifically natively!
    ai_input = {
        "total_target": total_target,
        "portfolio_value": portfolio_value,
        "market_summary": market_summary,
        "progress": progress
    }
    
    # Fire off AI Pipeline asynchronously securely mapping return JSON schemas natively
    ai_insight = await generate_summary_ai(ai_input)
    
    return {
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "overall_progress": progress,
        "portfolio_value": round(portfolio_value, 2),
        "total_target": round(total_target, 2),
        "gap": round(gap, 2),
        "goal_status": goal_status,
        "risk_level": risk_level,
        "ai_summary": ai_insight.get("ai_summary", ""),
        "suggestions": ai_insight.get("suggestions", "")
    }
