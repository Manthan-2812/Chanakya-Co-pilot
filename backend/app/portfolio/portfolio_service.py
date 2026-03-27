import asyncio
import yfinance as yf
import pandas as pd
from datetime import date
from typing import List, Dict, Any

# Simple static mapping for Bar Chart classification
SECTOR_MAPPING = {
    "TCS": "IT",
    "TCS.NS": "IT",
    "INFY": "IT",
    "INFY.NS": "IT",
    "RELIANCE": "Energy",
    "RELIANCE.NS": "Energy",
    "HDFCBANK": "Finance",
    "HDFCBANK.NS": "Finance"
}

def fetch_stock_history(symbol: str) -> pd.DataFrame:
    """
    Downloads the 1-month historical data for a symbol.
    Provides OHLC data for Candlestick charts and Line charts.
    """
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1mo")
        return hist
    except Exception:
        return pd.DataFrame()

async def analyze_portfolio(assets: List[dict]) -> dict:
    total_investment = 0.0
    total_value = 0.0
    
    candlestick_data = {}
    allocation = {}
    sector_values = {}
    
    # History accumulation for Line Chart (Date -> Value mapping)
    portfolio_history: Dict[str, float] = {}
    
    async def process_asset(asset: dict):
        nonlocal total_investment, total_value
        
        name = asset.get("name", "Unknown")
        symbol = asset.get("symbol")
        quantity = float(asset.get("quantity", 0.0))
        buy_price = float(asset.get("buy_price", 0.0))
        asset_type = asset.get("type", "stock")
        
        investment = buy_price * quantity
        total_investment += investment
        
        current_value = investment
        
        if asset_type == "stock" and symbol:
            hist = await asyncio.to_thread(fetch_stock_history, symbol)
            
            if not hist.empty and len(hist) > 0:
                current_price = float(hist["Close"].iloc[-1])
                current_value = current_price * quantity
                
                # 1. Prepare Candlestick array specifically formatted
                candles = []
                for timestamp, row in hist.iterrows():
                    date_str = timestamp.strftime("%Y-%m-%d")
                    candles.append({
                        "date": date_str,
                        "open": float(row["Open"]),
                        "high": float(row["High"]),
                        "low": float(row["Low"]),
                        "close": float(row["Close"])
                    })
                    
                    # 2. Accumulate this stock's daily historical values into total portfolio history!
                    day_value = float(row["Close"]) * quantity
                    portfolio_history[date_str] = portfolio_history.get(date_str, 0.0) + day_value
                    
                candlestick_data[symbol] = candles
            else:
                # API failure / invalid symbol fallback
                current_value = investment
                
        elif asset_type == "mutual_fund":
            # Mutual funds bypass external APIs and assume a fixed 10% projection growth
            # We are assuming 1 year of holding as there's no buy_date directly specified per instructions,
            # or simply applying a neat 10% on top of investment.
            current_value = investment * 1.10
            
        # 3. Handle PIE Chart Allocations
        allocation_key = symbol if symbol else name
        allocation[allocation_key] = allocation.get(allocation_key, 0.0) + current_value
        
        # 4. Handle BAR Chart (Sectors) Allocations dynamically
        lookup_key = symbol if symbol else name
        sector = SECTOR_MAPPING.get(lookup_key, SECTOR_MAPPING.get(name, "Others"))
        sector_values[sector] = sector_values.get(sector, 0.0) + current_value
        
        total_value += current_value
        
        return current_value, asset_type

    # Dispatch all assets concurrently using AsyncIO (crucial for IO blocking actions)
    tasks = [process_asset(asset) for asset in assets]
    results = await asyncio.gather(*tasks)
    
    # Process the MF baseline into history maps so they are accounted for historically
    # Since they don't have Daily OHLC paths, we add their current evaluation to every recorded stock day flatly
    mf_total_value = sum(v for v, atype in results if atype == "mutual_fund")
    
    line_chart = []
    if portfolio_history:
        for d in sorted(portfolio_history.keys()):
            line_chart.append({
                "date": d,
                "value": round(portfolio_history[d] + mf_total_value, 2)
            })
    else:
        # If user ONLY has mutual funds, we just output today's value
        line_chart.append({
            "date": date.today().strftime("%Y-%m-%d"),
            "value": round(total_value, 2)
        })

    # Output sanitization (rounding percentages accurately securely mapping against total)
    if total_value > 0:
        allocation = {k: round((v / total_value) * 100, 2) for k, v in allocation.items()}
        sector_values = {k: round((v / total_value) * 100, 2) for k, v in sector_values.items()}
        
    profit_loss = total_value - total_investment

    return {
        "total_value": round(total_value, 2),
        "total_investment": round(total_investment, 2),
        "profit_loss": round(profit_loss, 2),
        "allocation": allocation,
        "line_chart": line_chart,
        "bar_chart": sector_values,
        "candlestick": candlestick_data
    }
