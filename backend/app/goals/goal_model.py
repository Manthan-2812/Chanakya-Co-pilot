"""
Database Model definition for Goals (`wealth_ai.goals`)

This file is a structural reference as Pydantic (`goal_schema.py`) and standard Python dictionaries (handled in `goal_service.py`) map flawlessly to Motor's document ingestion.

Collection: `goals`

Each document stored in the database adheres to the following BSON structure:

```json
{
  "_id": ObjectId("..."),
  "user_id": "...",
  "goal_name": "...",
  "years": 5,
  "target_amount": 5000000.0,
  "risk_level": "Medium",
  "expected_return": 0.10,
  "inflation_adjusted_value": 6700000.0,
  "monthly_sip": 25000.0,
  "investments": [
    {
      "type": "stock",
      "name": "TCS",
      "symbol": "TCS.NS",
      "amount": 50000.0,
      "current_price": 4015.55,
      "projected_value": 80000.0
    },
    {
      "type": "mutual_fund",
      "name": "Axis Bluechip Fund",
      "symbol": null,
      "amount": 50000.0,
      "current_price": null,
      "projected_value": 85000.0
    }
  ],
  "created_at": datetime.datetime(...)
}
```
"""
