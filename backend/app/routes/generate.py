from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.services.llm import generate_image_prompt
from app.services.image_service import generate_art

router = APIRouter()

@router.post("/generate")
def generate(data: dict): 

    try:
        # 1. Extract the raw base64 string from the frontend payload
        image_data = data.get("image")
        if not image_data:
            return JSONResponse(
                status_code=400,
                content={"error": "No image data provided"}
            )
        
        # Strip the data URI prefix if present
        if "," in image_data:
            image_data = image_data.split(",")[1]

        # 2. Pass the sketch to the Vision LLM to get our magic prompt
        print("Analyzing sketch...")
        prompt = generate_image_prompt(image_data)
        print(f"Generated Prompt: {prompt}")

        # 3. Send both the prompt and the sketch to Fal.ai
        print("Generating artwork...")
        final_image_url = generate_art(prompt, image_data)

        # 4. Return the Fal.ai URL back to the frontend
        return {
            "image_url": final_image_url
        }
    
    except RuntimeError as e:
        print(f"[GENERATE ERROR] {e}")
        return JSONResponse(
            status_code=502,
            content={"error": str(e)}
        )
    except Exception as e:
        print(f"[GENERATE ERROR] Unexpected error: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"An unexpected error occurred: {str(e)}"}
        )