from pydantic import BaseModel, Field

class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="Input prompt for the model")
    max_length: int = Field(512, description="Maximum length of generated text")
    temperature: float = Field(0.7, ge=0.0, le=1.0, description="Sampling temperature")
    top_p: float = Field(0.95, ge=0.0, le=1.0, description="Nucleus sampling parameter")
    top_k: int = Field(50, ge=0, description="Top-k sampling parameter")

class GenerateResponse(BaseModel):
    response: str = Field(..., description="Generated response from the model") 