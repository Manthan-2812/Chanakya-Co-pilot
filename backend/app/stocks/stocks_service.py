import asyncio
import yfinance as yf
from typing import List
from app.stocks.stocks_schema import StockPosition, PositionResult

def _fetch_price(symbol: str) -> float | None:
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1d")
        if not hist.empty:
            return float(hist["Close"].iloc[-1])
    except Exception:
        pass
    return None

async def analyze_positions(positions: List[StockPosition]) -> dict:
    results = []
    total_invested = 0.0
    total_current = 0.0

    for pos in positions:
        current_price = await asyncio.to_thread(_fetch_price, pos.symbol)
        invested = pos.buy_price * pos.quantity
        current_val = (current_price * pos.quantity) if current_price else invested
        pnl = current_val - invested
        pnl_pct = (pnl / invested * 100) if invested > 0 else 0.0

        results.append(PositionResult(
            symbol=pos.symbol,
            name=pos.name,
            quantity=pos.quantity,
            buy_price=pos.buy_price,
            instrument_type=pos.instrument_type,
            current_price=current_price,
            current_value=round(current_val, 2),
            invested_value=round(invested, 2),
            pnl=round(pnl, 2),
            pnl_pct=round(pnl_pct, 2),
        ))
        total_invested += invested
        total_current += current_val

    total_pnl = total_current - total_invested
    total_pnl_pct = (total_pnl / total_invested * 100) if total_invested > 0 else 0.0

    return {
        "positions": results,
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current, 2),
        "total_pnl": round(total_pnl, 2),
        "total_pnl_pct": round(total_pnl_pct, 2),
    }
