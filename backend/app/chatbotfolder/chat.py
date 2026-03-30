from fastapi import APIRouter
from app.chatbotfolder.chat_schema import ChatRequest, ChatResponse
from app.chatbotfolder.ai_service import get_ai_response
from app.goals.db import goals_repo
from app.portfolio.portfolio_repository import portfolio_repo
from app.portfolio.portfolio_service import analyze_portfolio

router = APIRouter()

async def _build_user_context(user_id: str) -> str:
    """Fetch goals and portfolio for the user and return a compact context string."""
    lines = []

    # ── Goals ──────────────────────────────────────────────
    try:
        goals = await goals_repo.find_by_user(user_id)
        if goals:
            lines.append("USER'S FINANCIAL GOALS:")
            for g in goals:
                status = g.get("status", "active")
                lines.append(
                    f"  • {g.get('goal_name')} | Target: ₹{g.get('target_amount'):,.0f} | "
                    f"Horizon: {g.get('years')} yrs | Type: {g.get('investment_type')} | "
                    f"Monthly SIP: ₹{g.get('monthly_sip', 0):,.0f} | "
                    f"User invests: ₹{g.get('invest_amount', 0):,.0f}/mo | "
                    f"Achieves in: {round(g.get('months_to_achieve', 0)/12, 1)} yrs | Status: {status}"
                )
    except Exception:
        pass

    # ── Portfolio ──────────────────────────────────────────
    try:
        portfolios = await portfolio_repo.get_by_user(user_id)
        if portfolios:
            all_assets = []
            for p in portfolios:
                all_assets.extend(p.get("assets", []))
            if all_assets:
                analysis = await analyze_portfolio(all_assets)
                alloc = analysis.get("allocation", {})
                lines.append(f"USER'S PORTFOLIO: Total Value ₹{analysis.get('total_value', 0):,.0f} | "
                              f"P&L ₹{analysis.get('profit_loss', 0):,.0f} | "
                              f"Allocation: {alloc}")
    except Exception:
        pass

    if not lines:
        return ""

    return (
        "\n\n--- USER CONTEXT (use this to give personalised advice) ---\n"
        + "\n".join(lines)
        + "\n--- END CONTEXT ---"
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint to interact with the AI chatbot.
    Fetches user's goals and portfolio to give personalised advice.
    """
    user_context = await _build_user_context(request.user_id or "default_user")
    ai_reply = get_ai_response(request.message, user_context)
    return ChatResponse(reply=ai_reply)
