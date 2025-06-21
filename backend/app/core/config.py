from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Project name
    PROJECT_NAME: str = "Backend API"
    # API version prefix
    API_V1_STR: str = "/api/v1"
    
    # JWT secret key
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    # JWT algorithm
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    # Token expiration time (30 minutes)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    # Database URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings() 