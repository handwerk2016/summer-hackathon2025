from sqlalchemy.ext.declarative import declarative_base  # SQLAlchemy ORM base
from sqlalchemy.orm import DeclarativeMeta  # Type hint for Base

# Create SQLAlchemy declarative base
Base: DeclarativeMeta = declarative_base()

# Import base class
from app.db.base_class import Base  # SQLAlchemy declarative base

# Import all models to ensure they are registered with SQLAlchemy
from app.models.user import User  # User model 