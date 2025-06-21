from pydantic import BaseModel  # Pydantic models

class UserBase(BaseModel):
    """
    Base user schema with common attributes
    """
    username: str

class UserCreate(UserBase):
    """
    User creation schema with password
    """
    password: str  # Plain text password (not stored)

class User(UserBase):
    """
    User response schema
    """
    id: int  # User ID

    class Config:
        from_attributes = True  # Enable ORM mode 