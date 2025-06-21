from pydantic_settings import BaseSettings  # Settings management
from typing import Optional  # Type hints
from dotenv import load_dotenv  # Environment variables
import os  # OS utilities

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # API information
    PROJECT_NAME: str = "Auth API"
    API_V1_STR: str = "/api/v1"  # API version prefix
    
    # JWT configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Database configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    class Config:
        env_file = ".env"  # Environment file path
        env_file_encoding = "utf-8"  # Environment file encoding

# Global settings instance
settings = Settings() 