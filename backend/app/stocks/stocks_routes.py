from fastapi import APIRouter, HTTPException
from app.stocks.stocks_schema import StocksAddRequest, StocksResponse
from app.stocks.stocks_repository import stocks_repo
from app.stocks.stocks_service import analyze_positions

router = APIRouter(prefix="/stocks", tags=["Stocks & Derivatives"])

@router.post("/{user_id}", response_model=StocksResponse)
async def save_and_analyze(user_id: str, request: StocksAddRequest):
    """Save stock/futures positions and return live P&L analysis."""
    try:
        raw = [p.dict() for p in request.positions]
        await stocks_repo.save(user_id, raw)
        analysis = await analyze_positions(request.positions)
        return StocksResponse(user_id=user_id, **analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}", response_model=StocksResponse)
async def get_positions(user_id: str):
    """Fetch saved positions with live prices."""
    raw = await stocks_repo.get_by_user(user_id)
    if not raw:
        return StocksResponse(
            user_id=user_id, positions=[], total_invested=0,
            total_current_value=0, total_pnl=0, total_pnl_pct=0,
        )
    from app.stocks.stocks_schema import StockPosition
    positions = [StockPosition(**p) for p in raw]
    analysis = await analyze_positions(positions)
    return StocksResponse(user_id=user_id, **analysis)
