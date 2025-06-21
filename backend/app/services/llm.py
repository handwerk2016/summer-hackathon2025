from typing import Optional  # For type hints
from transformers import AutoTokenizer, AutoModelForCausalLM  # Core LLM components
import torch  # PyTorch ML framework
from pathlib import Path  # Path manipulation
import os  # OS utilities

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

        print(f"Model loaded successfully on {self.device}")
        print(f"Model dtype: {self.model.dtype}")

    async def generate_response(
        self,
        prompt: str,  # Input text
        max_length: int = 512,  # Max output length
        temperature: float = 0.7,  # Randomness control
        top_p: float = 0.95,  # Nucleus sampling threshold
        top_k: int = 50,  # Top-k sampling threshold
    ) -> str:
        """
        Generate a response from the model given a prompt
        """
        try:
            # Format prompt for Gemma chat format
            formatted_prompt = f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model"
            
            # Tokenize input
            inputs = self.tokenizer(
                formatted_prompt,
                return_tensors="pt",  # PyTorch format
                padding=True,  # Enable padding
                truncation=True,  # Enable truncation
                max_length=max_length,  # Max sequence length
                add_special_tokens=True  # Add model-specific tokens
            ).to(self.device)

            # Generate with safety limits
            with torch.no_grad():  # Disable gradient computation
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=min(max_length, 256),  # Cap output length
                    do_sample=True,  # Enable sampling
                    temperature=max(0.1, min(temperature, 1.0)),  # Bound temperature
                    top_p=max(0.1, min(top_p, 1.0)),  # Bound top_p
                    top_k=max(1, min(top_k, 100)),  # Bound top_k
                    pad_token_id=self.tokenizer.pad_token_id,  # Padding token
                    eos_token_id=self.tokenizer.eos_token_id,  # End token
                    repetition_penalty=1.1,  # Penalize repetitions
                    length_penalty=1.0,  # Length control
                    no_repeat_ngram_size=2  # Prevent 2-gram repeats
                )

            # Decode output tokens to text
            response = self.tokenizer.decode(
                outputs[0],  # Take first sequence
                skip_special_tokens=True,  # Remove special tokens
                clean_up_tokenization_spaces=True  # Clean whitespace
            )
            
            # Clean up response
            response = response.replace(formatted_prompt, "").strip()
            if "<end_of_turn>" in response:
                response = response.split("<end_of_turn>")[0].strip()
            
            return response

        except Exception as e:
            # Log error details
            print(f"Error during generation: {str(e)}")
            print(f"Current device: {self.device}")
            print(f"Model dtype: {self.model.dtype}")
            print(f"Input shape: {inputs.input_ids.shape}")
            raise

# Global model instance
llm_service: Optional[LLMService] = None

def get_llm_service() -> LLMService:
    """
    Get or create LLM service instance (singleton pattern)
    """
    global llm_service
    if llm_service is None:  # Create if not exists
        llm_service = LLMService()
    return llm_service 