from fastapi import APIRouter, HTTPException
from app.market.market_schema import MarketResponse
from app.market.market_service import analyze_market
from app.market.gemini_service import generate_market_insight

router = APIRouter(prefix="/market", tags=["Market Sentiment"])

@router.get("/summary", response_model=MarketResponse)
async def get_market_summary():
    """
    1. Fetches live daily market indices dynamically mapped across 3 major logic blocks.
    2. Groups calculated representative percentages against specific strings natively (Bullish, Bearish).
    3. Triggers Google Gemini processing logic seamlessly to wrap up output summaries.
    """
    try:
        # Await async data pipeline fetching real-time OHLC histories via threading securely!
        market_stats = await analyze_market()
        
        # Fire off Google AI logic concurrently matching structural properties explicitly mapping JSONs natively
        ai_response = await generate_market_insight(market_stats)
        
        # Combine explicitly matching formatting requirements!
        return MarketResponse(
            market_trend=market_stats.get("market_trend", "Neutral"),
            nifty_change=market_stats.get("nifty_change", 0.0),
            sensex_change=market_stats.get("sensex_change", 0.0),
            sector_signals=market_stats.get("sector_signals", {}),
            ai_summary=ai_response.get("ai_summary", ""),
            suggestion=ai_response.get("suggestion", ""),
            market_context=ai_response.get("market_context", "")
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Unable to process Market Analytics: {str(e)}"
        )
