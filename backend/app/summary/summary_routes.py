from fastapi import APIRouter, HTTPException
from app.summary.summary_schema import SummaryResponse
from app.summary.summary_service import build_user_summary

router = APIRouter(prefix="/summary", tags=["Overall Summaries"])

@router.get("/{user_id}", response_model=SummaryResponse)
async def get_user_overall_summary(user_id: str):
    """
    1. Triggers asynchronous database extractions across the goals collection, portfolio arrays, and live Market pipelines.
    2. Aggegrates mathematical completion ratios explicitly mapping standard math strings.
    3. Prompts the internal AI service mapping structural insights returning perfectly valid JSON boundaries.
    """
    try:
        # Await the central cross-module aggregation handler seamlessly
        analysis = await build_user_summary(user_id)
        
        # Package identically into validation schemas
        return SummaryResponse(**analysis)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Unable to aggregate structural summary: {str(e)}"
        )
