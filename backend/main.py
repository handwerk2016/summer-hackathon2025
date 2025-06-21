from fastapi import FastAPI, status  # FastAPI core and HTTP status codes
from fastapi.middleware.cors import CORSMiddleware  # CORS support
from fastapi.responses import RedirectResponse  # URL redirects
from app.core.config import settings  # App settings
from app.api.v1 import auth, users, llm  # API route modules
from app.db.base_class import Base  # SQLAlchemy Base class
from app.db.session import engine  # Database engine

# Create database tables on startup
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app with OpenAPI config
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Authentication API with JWT and Gemma LLM integration",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with a list of allowed domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint redirects to API docs
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url=f"{settings.API_V1_STR}/docs")

# Health check endpoint for monitoring
@app.get(f"{settings.API_V1_STR}/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "api_version": "v1"
    }

# Register API routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"]
)
app.include_router(
    users.router,
    prefix=f"{settings.API_V1_STR}/users",
    tags=["users"]
)
app.include_router(
    llm.router,
    prefix=f"{settings.API_V1_STR}/llm",
    tags=["llm"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload on code changes
    ) 