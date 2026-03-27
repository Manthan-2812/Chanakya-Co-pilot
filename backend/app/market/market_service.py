import asyncio
import yfinance as yf
from typing import Dict, Any

def get_change(symbol: str) -> float:
    """
    Synchronous fetching layer capturing the last two valid trading days specifically.
    """
    try:
        ticker = yf.Ticker(symbol)
        # Using 5 days ensures we always cleanly grab the last two trading sessions even across long weekends.
        hist = ticker.history(period="5d")
        if len(hist) >= 2:
            yesterday_close = float(hist["Close"].iloc[-2])
            today_close = float(hist["Close"].iloc[-1])
            change = ((today_close - yesterday_close) / yesterday_close) * 100
            return round(change, 2)
    except Exception:
        pass
    return 0.0

def determine_signal(change: float) -> str:
    """ Maps percentage change strictly to the standard strings assigned. """
    if change > 1.0:
        return "Bullish"
    elif change < -1.0:
        return "Bearish"
    return "Neutral"

async def analyze_market() -> Dict[str, Any]:
    """
    Asynchronously parses indices alongside explicit sector signals.
    """
    # 1. Dispatching API fetchers natively across standard python threads
    nifty_task = asyncio.to_thread(get_change, "^NSEI")
    sensex_task = asyncio.to_thread(get_change, "^BSESN")
    
    # We await index tasks easily dynamically matching prompt rules cleanly 
    nifty_change, sensex_change = await asyncio.gather(nifty_task, sensex_task)
    
    # Define sector mappings
    sectors = {
        "IT": ["TCS.NS", "INFY.NS"],
        "Banking": ["HDFCBANK.NS", "ICICIBANK.NS"],
        "Energy": ["RELIANCE.NS"]
    }
    
    sector_signals = {}
    
    # 2. Iterate concurrently calculating sector change values
    for sector_name, tickers in sectors.items():
        changes = await asyncio.gather(*(asyncio.to_thread(get_change, sym) for sym in tickers))
        
        # Determine average logic specifically mapping logic natively
        avg_change = sum(changes) / len(changes) if len(changes) > 0 else 0.0
        sector_signals[sector_name] = determine_signal(avg_change)

    # 3. Overall Market Trend mapping taking the primary NIFTY index change
    market_trend = determine_signal(nifty_change)

    return {
        "market_trend": market_trend,
        "nifty_change": nifty_change,
        "sensex_change": sensex_change,
        "sector_signals": sector_signals
    }
