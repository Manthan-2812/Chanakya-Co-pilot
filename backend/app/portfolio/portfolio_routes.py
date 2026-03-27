from fastapi import APIRouter
from app.portfolio.portfolio_schema import PortfolioCreate, PortfolioResponse
from app.portfolio.portfolio_repository import portfolio_repo
from app.portfolio.portfolio_service import analyze_portfolio

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("/assets", response_model=list)
async def get_assets():
    """
    Returns static list of assets for the frontend MVP dropdown selectors.
    Must be defined BEFORE /{user_id} structurally!
    """
    return [
        { "type": "stock", "name": "TCS", "symbol": "TCS.NS" },
        { "type": "stock", "name": "INFY", "symbol": "INFY.NS" },
        { "type": "stock", "name": "RELIANCE", "symbol": "RELIANCE.NS" },
        { "type": "mutual_fund", "name": "Axis Bluechip Fund" },
        { "type": "mutual_fund", "name": "SBI Small Cap Fund" },
        { "type": "mutual_fund", "name": "ICICI Prudential Technology Fund" }
    ]

@router.post("/create", response_model=PortfolioResponse)
async def create_portfolio(request: PortfolioCreate):
    """
    Persistently mock-saves portfolio data, dynamically analyzes real-time fetches 
    across yfinance, and outputs total PortfolioResponse layout.
    """
    # 1. Map to raw and save cleanly mimicking future DB models
    raw_data = request.dict()
    await portfolio_repo.save(raw_data)
    
    # 2. Service Logic Execution (Architecture Rules: separate logic dependencies)
    analysis = await analyze_portfolio(raw_data.get("assets", []))
    
    # 3. Output
    return PortfolioResponse(user_id=request.user_id, **analysis)

@router.get("/{user_id}", response_model=PortfolioResponse)
async def get_portfolio(user_id: str):
    """
    Fetches raw portfolios and dynamically re-calculates all live variables.
    """
    portfolios = await portfolio_repo.get_by_user(user_id)
    
    # Check if empty (mocking empty MongoDB)
    if not portfolios:
        return PortfolioResponse(
            user_id=user_id, total_value=0.0, total_investment=0.0, profit_loss=0.0,
            allocation={}, line_chart=[], bar_chart={}, candlestick={}
        )
        
    # Standardize handling of multi-portfolios (combine arrays)
    all_assets = []
    for p in portfolios:
        all_assets.extend(p.get("assets", []))
        
    analysis = await analyze_portfolio(all_assets)
    return PortfolioResponse(user_id=user_id, **analysis)
