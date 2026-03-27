# Goal Setting Module

This module handles creating and retrieving user financial goals. It cleanly connects to a MongoDB database to securely store user-driven financial aspirations, calculating out key metrics like Inflation Adjusted Value and corresponding SIP (Systematic Investment Plan) automatically!

## 🚀 Setup
Before making API calls to this module, ensure you have:
1. Provided your `MONGO_URI` in the root `.env` file (e.g., `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/`). The backend connects to the `wealth_ai` database automatically.
2. Ensure you have installed Motor and PyMongo and yfinance via `requirements.txt`.

## 🌐 API Overview

### 1. Retrieve Assets: `GET /goals/assets`
Returns a static list of Indian assets to be used for the frontend MVP without needing external API lookups.
```json
[
  { "type": "stock", "name": "TCS", "symbol": "TCS.NS" },
  { "type": "mutual_fund", "name": "Axis Bluechip Fund" }
]
```

### 2. Live Investment Projection: `POST /goals/calculate-investment`
Calculates values independently outside of goal creation, very handy for generic financial tool pages!
**Body Example:**
```json
{
  "investments": [
    {
      "type": "stock",
      "name": "TCS",
      "symbol": "TCS.NS",
      "amount": 50000
    }
  ],
  "years": 5,
  "risk_level": "Medium"
}
```
**Response Returns:** Array of matching outputs + Total sum.

### 3. Create a New Goal: `POST /goals/create`
Pass in basic financial goals to have the API do all the math to adjust for inflation and calculate risk. Also parses `investments` arrays independently if passed.

**Frontend Request Pattern (Next.js Example):**
```ts
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/create`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: "user123",
    goal_name: "Buy a House",
    years: 5,
    target_amount: 5000000,
    investments: [
      {
        "type": "mutual_fund",
        "name": "SBI Small Cap Fund",
        "amount": 25000
      }
    ]
  })
});
const newGoalData = await response.json();
```

**What it calculates for you:**
- **Risk Profile** (Low for < 3 years, Medium for 3-7 years, High for 7+ years)
- **Expected Annual Return** (Low: 6%, Medium: 10%, High: 14%)
- **Target adjusting for 6% Inflation** (`FV = target_amount * (1 + 0.06)^years`)
- **Required Monthly SIP**
- **Associated Investments projection mapping**, generating static expected values out over `years`. For stocks (`"type": "stock"`), it securely attempts fetching the absolute newest Close Price using python's `yfinance` in an asynchronous background thread so it never blocks the request event loops!

### 4. Retrieve User Goals: `GET /goals/{user_id}`
Returns a list of every goal that user has stored in MongoDB natively matching schemas.

## 📁 Module Folder Structure

- `__init__.py`: Identifies folder as a module.
- `goal_schema.py`: Pydantic classes serving as our API structure guards. Contains base inputs alongside Investment Inputs arrays.
- `goal_service.py`: Contains our primary business logic, calculating SIP, inflation adjustment, and iterating investment properties alongside async `to_thread(yfinance)`.
- `goal_routes.py`: Registers our HTTP POST and GET endpoints using FastAPI Router tags.
- `db.py`: Initializes an AsyncIOMotorClient.
- `goal_model.py`: Reference document for identifying structural schemas on MongoDB.
