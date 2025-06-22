from typing import Optional  # For type hints
from transformers import AutoTokenizer, AutoModelForCausalLM  # Core LLM components
import torch  # PyTorch ML framework
from pathlib import Path  # Path manipulation
import os  # OS utilities
from app.core.config import settings  # Import settings for system prompt
from concurrent.futures import ThreadPoolExecutor  # For parallel processing
import asyncio  # For async operations

class LLMService:
    def __init__(self):
        self.device = "cpu"  # Force CPU usage cuz we got no server with GPU
        # Get absolute path to the model
        current_dir = Path(os.getcwd())
        self.model_path = str(current_dir / "models" / "gemma-3-4b-it")
        
        # Initialize tokenizer and model
        print(f"Loading model from {self.model_path}")
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_path,
            local_files_only=True,  # Skip online model fetching
            padding_side="left"  # Left padding for better generation
        )
        
        print("Loading model in float32 mode on CPU...")
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_path,
            device_map=None,  # Disable device mapping
            torch_dtype=torch.float32,  # Use float32 for CPU compatibility
            local_files_only=True,  # Skip online model fetching
            low_cpu_mem_usage=True  # Optimize memory usage
        ).to(self.device)

        # Set padding token to eos token if not set
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.model.config.pad_token_id = self.model.config.eos_token_id

        # Initialize thread pool for parallel processing
        self.executor = ThreadPoolExecutor(max_workers=2)  # Adjust based on CPU cores

        print(f"Model loaded successfully on {self.device}")
        print(f"Model dtype: {self.model.dtype}")

    def _generate_response_sync(
        self,
        formatted_prompt: str,
        max_length: int,
        temperature: float,
        top_p: float,
        top_k: int
    ) -> str:
        """
        Synchronous generation function to run in thread pool
        """
        try:
            # Tokenize input
            inputs = self.tokenizer(
                formatted_prompt,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=max_length,
                add_special_tokens=True
            ).to(self.device)

            # Generate with safety limits
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=min(max_length, 512),
                    do_sample=True,
                    temperature=temperature,
                    top_p=top_p,
                    top_k=top_k,
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                    repetition_penalty=1.2,
                    length_penalty=1.0,
                    no_repeat_ngram_size=3
                )

            # Decode output tokens to text
            response = self.tokenizer.decode(
                outputs[0],
                skip_special_tokens=True,
                clean_up_tokenization_spaces=True
            )
            
            # Clean up response
            turns = response.split("<start_of_turn>")
            for turn in turns:
                if turn.startswith("model"):
                    response = turn.replace("model", "").strip()
                    break
            
            response = response.split("<end_of_turn>")[0].strip()
            return response

        except Exception as e:
            print(f"Error during generation: {str(e)}")
            print(f"Current device: {self.device}")
            print(f"Model dtype: {self.model.dtype}")
            raise

    async def generate_response(
        self,
        prompt: str,
        max_length: int = 1024,
        temperature: float = 0.7,
        top_p: float = 0.95,
        top_k: int = 50,
    ) -> str:
        """
        Asynchronous generate response method
        """
        formatted_prompt = f"<start_of_turn>system\n{settings.SYSTEM_PROMPT}<end_of_turn>\n<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\nLet me help you with that."
        
        # Run generation in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            self.executor,
            self._generate_response_sync,
            formatted_prompt,
            max_length,
            temperature,
            top_p,
            top_k
        )
        
        return response

    def __del__(self):
        """
        Cleanup resources on deletion
        """
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=True)

# Global model instance
llm_service: Optional[LLMService] = None

def get_llm_service() -> LLMService:
    """
    Get or create LLM service instance (singleton pattern)
    """
    global llm_service
    if llm_service is None:
        llm_service = LLMService()
    return llm_service 