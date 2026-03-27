import os
import base64
import io
from PIL import Image
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the Hugging Face Inference Client
# Using Stable Diffusion XL Base 1.0
client = InferenceClient(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    token=os.getenv("HF_TOKEN")
)

def generate_art(prompt: str, base64_image: str) -> str:
    """
    Takes a prompt from the LLM and the original sketch, 
    and generates a minimalist doodle version.
    """
    
    # 1. Clean the LLM prompt (remove any conversational filler)
    clean_prompt = prompt.replace("Output:", "").strip()
    
    # 2. Style Injection: 
    # We force the model to stay minimalist by wrapping the prompt
    final_prompt = f"A simple minimalist doodle of {clean_prompt}, clean line art, flat design, white background, simple illustration."
    
    # 3. Negative Prompting:
    # This explicitly tells the AI what NOT to do (banishing the 'complex' look)
    negative_elements = "photorealistic, 3d render, cinematic, shadows, detailed, intricate, textured, messy, dark background, colorful gradients, realistic skin, hyperdetailed"

    print(f"--- Artist Service ---")
    print(f"Refined Prompt: {final_prompt}")

    try:
        # 4. Generate the image using Hugging Face Hub
        # text_to_image handles the API calls and loading states automatically
        image = client.text_to_image(
            final_prompt,
            negative_prompt=negative_elements,
            guidance_scale=8.5, # Higher guidance makes it follow the 'simple' prompt more strictly
            num_inference_steps=30 # 30 steps is a good balance of quality and speed
        )

        # 5. Convert the PIL Image object to a Base64 string
        # This allows us to send the image data directly to the React frontend
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG") # JPEG is smaller for faster transmission
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Return the Data URI that the <img> tag in React expects
        return f"data:image/jpeg;base64,{img_str}"

    except Exception as e:
        print(f"[IMAGE SERVICE ERROR] {str(e)}")
        # If the model is too busy or the token is invalid, we raise an error
        # that our FastAPI router will catch and report
        raise RuntimeError(f"HuggingFace Generation Failed: {str(e)}")