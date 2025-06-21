from pydantic import BaseModel  # Pydantic models
from typing import Optional  # Type hints

class Token(BaseModel):
    """
    Token response schema
    """
    access_token: str  # JWT access token
    token_type: str  # Token type (bearer)

class TokenData(BaseModel):
    """
    Token payload schema
    """
    username: Optional[str] = None  # Username from token 