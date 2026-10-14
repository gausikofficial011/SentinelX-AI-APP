from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.copilot_service import process_copilot_query

router = APIRouter()

class CopilotQueryRequest(BaseModel):
    query: str
    context_case_id: Optional[str] = None
    session_id: Optional[str] = None

@router.post("/query", response_model=Dict[str, Any])
async def query_copilot(request: CopilotQueryRequest):
    """
    Accepts a natural language query from an officer/investigator,
    retrieves context from the database, and returns an AI-generated answer.
    """
    result = await process_copilot_query(
        query=request.query, 
        context_case_id=request.context_case_id
    )
    
    return {
        "success": True,
        "data": result
    }
