# Market Analytics & Sentiment Module

This module utilizes live yfinance data streams to compute real-time index metrics alongside a powerful AI Engine (Google Gemini) securely interpreting those inputs into perfectly formatted insights for immediate frontend parsing! 

## 🚀 Environment Setup
To operate this module completely, ensure:
1. `GEMINI_API_KEY` is formally exported alongside your variables in `backend/.env`.
2. Packages matching `google-generativeai, yfinance` exist (run `pip install -r requirements.txt`).

## 🌐 API Overview

### 1. Retrieve Current AI Summary: `GET /market/summary`
The singular endpoint dynamically triggers 6 separate history lookups (NIFTY, SENSEX, TCS, INFY, HDFC, ICICI, RELIANCE) securely mapped out concurrently. After mapping simple mathematical logic internally for `Bullish` vs `Bearish` strings asynchronously, the engine submits the data dynamically directly cleanly into Gemini and formats its JSON dict return!

**Sample Payload:**
```json
{
  "market_trend": "Bullish",
  "nifty_change": 1.25,
  "sensex_change": 1.10,
  "sector_signals": {
    "IT": "Bullish",
    "Banking": "Bearish",
    "Energy": "Neutral"
  },
  "ai_summary": "Overall market trend is very positive thanks to strong banking recoveries today.",
  "suggestion": "Stay invested.",
  "market_context": "Market is notably Bullish today."
}
```

The extremely handy string `market_context` natively maps one-liners suitable to cleanly pass directly into conversational bot logic!

## 📁 Repository vs Service
Continuing Clean Architecture mapping:
1. `gemini_service.py`: Generative SDK instances logic mapping text outputs iteratively back down dynamically securely. Returns fallback context string if `.env` fails logic tests cleanly without breaking.
2. `market_service.py`: Extracts raw mathematical computations looping Yahoo finance natively asynchronously cleanly!
3. `market_schema.py`: Pydantic typing handling the return variables safely directly via standard strings.
