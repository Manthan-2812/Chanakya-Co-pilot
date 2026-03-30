# 🪔 Chanakya — AI Financial Co-pilot for Indian Investors

> *Named after the ancient Indian strategist, Chanakya is an intelligent financial dashboard that knows your portfolio, watches the market live, and gives you answers a personal advisor would charge thousands for.*

Built for **ET Markets Hackathon — Problem #6: AI for the Indian Investor**
Category: **Market ChatGPT — Next Gen**

---

## 🚀 Live Features

| Module | What it does |
|---|---|
| **Goal Planner** | Inflation-adjusted SIP goals with achievement timelines and 6-way investment comparison |
| **Portfolio Tracker** | Live P&L for stocks via Yahoo Finance, asset allocation pie chart |
| **Market Intelligence** | Real-time NIFTY 50 + SENSEX, AI sector signals, live ET headlines via RSS |
| **Portfolio-Aware Chatbot** | AI reads your actual goals + portfolio before every answer — not a generic template |
| **Goal Summary** | Animated timelines, mark-complete and delete goals |
| **Money Math** | Embedded SIP, EMI, compound interest calculator |

---

## 🧠 What Makes the Chatbot Different

Most financial chatbots give textbook answers. Chanakya automatically fetches your **live goals and stock positions** before every AI query and injects them as context.

**Example:** Ask *"Rebalance my portfolio"* and it responds with:
- *"Your Retirement Corpus is overfunded — investing ₹9,000 more than required"*
- *"Child Education is underfunded by ₹4,327/month"*
- *"Home Down Payment in FD — rate cuts are narrowing your returns"*

Real goal names. Real rupee amounts. Zero generic templates.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Next.js 16** + React 19
- **Tailwind CSS v4** for styling
- **Framer Motion** for page transitions and animations
- **Recharts** for pie charts, line charts, bar charts
- **Zustand** for global state (theme, chatbot panel)
- **Lucide React** for icons

### Backend (`/backend`)
- **FastAPI** (Python) — async REST API
- **Groq API** (Gemma 2.5 Flash) — sub-2s AI responses
- **Yahoo Finance (`yfinance`)** — live NIFTY, SENSEX, stock LTP and P&L
- **Economic Times RSS Feed** — live market headlines
- **JSON file store** — goals persistence (MongoDB-ready)

---

## 📁 Project Structure

```
Chanakya-Co-pilot/
├── backend/
│   └── app/
│       ├── chatbotfolder/     # AI service, chat routes, schema
│       ├── goals/             # Goal CRUD, SIP calculator, JSON store
│       ├── market/            # NIFTY/SENSEX + ET RSS news
│       ├── portfolio/         # Portfolio routes + analysis
│       ├── stocks/            # Live stock P&L
│       ├── summary/           # User summary aggregation
│       ├── config.py          # Environment config
│       └── main.py            # FastAPI app entry point
├── client/
│   └── app/
│       ├── dashboard/
│       │   ├── goals/         # Goal planner page
│       │   ├── portfolio/     # Portfolio + allocation page
│       │   ├── market/        # Market intelligence page
│       │   ├── simulation/    # Risk simulation page
│       │   ├── summary/       # Goal timeline summary page
│       │   └── money-math/    # Embedded calculator
│       └── page.js            # Landing page
└── README.md
```

---

## ⚙️ Setup & Run

### Prerequisites
- Python 3.12+
- Node.js 18+
- Groq API key → [console.groq.com](https://console.groq.com)

### Backend
```bash
cd backend
pip install -r requirements.txt
# Create .env file with:
# GROQ_API_KEY=your_key_here
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat` | AI chatbot with user context injection |
| GET | `/goals/{user_id}` | Fetch user's goals |
| POST | `/goals/create` | Create a new goal with SIP calculation |
| DELETE | `/goals/{user_id}/{goal_id}` | Delete a goal |
| PATCH | `/goals/{user_id}/{goal_id}/complete` | Mark goal complete |
| GET | `/market/summary` | Live NIFTY + SENSEX + sector signals |
| GET | `/market/news` | Live ET headlines via RSS |
| GET | `/portfolio/{user_id}` | User portfolio + allocation |
| GET | `/stocks/{user_id}` | Live stock P&L |
| GET | `/summary/{user_id}` | Aggregated user summary |

---

## 📸 Key Pages

- **Landing Page** — Animated hero, feature cards with flip animation, stats section
- **Goals Page** — SIP form with live stock instrument analyser
- **Summary Page** — Animated goal timelines, 6-way investment comparison chart
- **Market Page** — Live indices, sector signals, Economic Times news feed
- **Portfolio Page** — Live P&L strip, allocation pie chart, AI insight card
- **Chatbot** — Floating panel, quick action buttons, portfolio-aware AI responses

---

## 👥 Team

Built for ET Markets Hackathon 2026 | Problem #6 — AI for the Indian Investor

Team : Fire and Water .
Team Leader : Manthan Parekh
Team Member : Aryan Sutariya
