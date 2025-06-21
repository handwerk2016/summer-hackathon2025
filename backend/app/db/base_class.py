from sqlalchemy.ext.declarative import declarative_base  # SQLAlchemy ORM base
from sqlalchemy.orm import DeclarativeMeta  # Type hint for Base

# Create SQLAlchemy declarative base
Base: DeclarativeMeta = declarative_base() 