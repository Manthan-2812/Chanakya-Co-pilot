# Summary Module

This module serves as the **capstone aggregator** for the entire backend application! It mathematically links across every previous module independently and pipes the total unified data securely into an AI to provide human-readable actionable insights directly down the line seamlessly.

## 🚀 Setup & Execution
No extra `requirements.txt` configurations are needed uniquely for this folder. Ensure your `GROQ_API_KEY` is formally registered inside the root `.env` securely! (Note: The AI generator here leverages Groq natively to guarantee no 429 Google rate-limits natively block your core application logic).

## 🌐 API Overview

### 1. Retrieve Unified Dashboard Summary: `GET /summary/{user_id}`
This is the most powerful endpoint in your API structure. Internally, when triggered:
1. It looks up `user_id` inside the `goals_collection` (MongoDB).
2. It looks up `user_id` inside the `portfolio_repo` (Memory Array).
3. It launches `app.market.analyze_market()` to fetch real-world current metrics natively from yfinance!
4. Calculations map progress, totals, targets, gap deficits, and strict Status conditions (`Behind`, `Moderate`, `On Track`).
5. Passes the mathematical summaries to an AI endpoint targeting specifically strictly formatted `json_object` configurations!

**Frontend React/Next.js Action Format:**
```ts
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summary/user123`);
const data = await response.json();

console.log(data.total_goals); // Integers natively mapping
console.log(data.overall_progress); // Percentages automatically calculated
console.log(data.goal_status); // Strict strings ready for UI Component colored maps!
console.log(data.ai_summary); // Long-form readable contextual intelligence natively.
```

## 📁 Internal Architecture Paths
- `summary_schema.py`: Validates mathematical boundaries securely.
- `summary_repository.py`: Acts as an explicit abstraction map referencing standard structural arrays from other modules securely. (Extremely easy to replace with native `aggregate()` pipelines eventually down the line).
- `summary_service.py`: Iterates computations independently handling `gap` and `status` mappings explicitly outside API loop logic organically!
