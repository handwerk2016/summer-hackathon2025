from sqlalchemy import Column, Integer, String  # SQLAlchemy column types
from app.db.base_class import Base  # SQLAlchemy declarative base

class User(Base):
    """
    User model for database
    """
    __tablename__ = "users"  # Database table name

    # User attributes
    id = Column(Integer, primary_key=True, index=True)  # Primary key
    username = Column(String, unique=True, index=True)  # Unique username
    hashed_password = Column(String)  # Hashed password 