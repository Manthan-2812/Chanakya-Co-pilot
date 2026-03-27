# Portfolio Module

This module enables users to submit investment assets (Stocks & Mutual Funds), generating robust dynamic visual endpoints in return. Designed natively to decouple raw logic (repository) from computed math (service), matching clean architecture principles precisely!

## 🚀 Setup & Installation
Ensure `yfinance`, `pandas`, and `mplfinance` are installed. This allows async generation of live historical maps!
(See `requirements.txt`).

## 🌐 API Overview

### 1. Fetch Dummy Models: `GET /portfolio/assets`
Returns list of stocks/MFs cleanly for frontend selection.

### 2. Post New Portfolio: `POST /portfolio/create`
Submits arrays of Assets, mapping them onto in-memory logic. Example Body:
```json
{
  "user_id": "user123",
  "assets": [
    {
      "type": "stock",
      "name": "TCS",
      "symbol": "TCS.NS",
      "quantity": 10,
      "buy_price": 3800.0
    },
    {
      "type": "mutual_fund",
      "name": "Axis Bluechip Fund",
      "quantity": 1,
      "buy_price": 50000.0
    }
  ]
}
```

### 3. Fetch Computed Portfolio Analytics: `GET /portfolio/{user_id}`
Dynamically generates complete mapping layouts (no caching). 

#### Breakdown of Output Metrics:
- **`total_value` & `profit_loss`**
- **Allocation Dictionary (Pie Chart Mapping)**: Key maps to percentages natively.
- **`candlestick` (JSON mapping for frontend charting like MPLFinance / Lightweight Charts)**:
  Exposed mapping standard sets of `"open"`, `"close"`, `"high"`, `"low"` data per asset!
- **`line_chart` (Compound Portfolio History)**:
  Calculates a total compounded historical representation mapping strings `date -> sum` tracking exactly how much the portfolio shifted day to day over the last month. 
- **`bar_chart` (Sector Exposures)**: 
  Matches hardcoded identifiers directly into buckets natively!

## 📁 Repository vs Service
This folder enforces a Repository Pattern!
1. `portfolio_repository.py`: Treats Python Arrays natively as storage, mimicking exactly how MongoDB structures would interface it later natively.
2. `portfolio_service.py`: Computes data securely isolated from saving routines! Ensures high testability down the line!
