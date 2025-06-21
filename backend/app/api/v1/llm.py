from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.llm import get_llm_service, LLMService
from app.schemas.llm import GenerateRequest, GenerateResponse
from app.api.v1.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/generate", response_model=GenerateResponse)
async def generate_text(
    request: GenerateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    llm: LLMService = Depends(get_llm_service)
) -> GenerateResponse:
    """
    Generate text using the Gemma model
    """
    try:
        response = await llm.generate_response(
            prompt=request.prompt,
            max_length=request.max_length,
            temperature=request.temperature,
            top_p=request.top_p,
            top_k=request.top_k
        )
        return GenerateResponse(response=response)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        ) 