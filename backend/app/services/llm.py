from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

from dotenv import load_dotenv

load_dotenv()

def get_llm():

    llm = ChatGroq(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        timeout=60,  # 60 second timeout to prevent hanging
    )
    return llm


def generate_image_prompt(base64_image: str) -> str:
    
    try:
        llm = get_llm()

        # message = HumanMessage(
        # content=[
        #     {
        #         "type": "text", 
        #         "text": "You are an expert AI art prompt engineer. Describe this sketch and write a highly detailed, descriptive prompt for an Image-to-Image model to turn it into a beautiful digital artwork. ONLY return the prompt, no other conversational text."
        #     },
        #     {
        #         "type": "image_url",
        #         "image_url": {"url": f"data:image/png;base64,{base64_image}"},
        #     },
        #     ]
        # )
        # Inside llm.py -> generate_image_prompt function

        message = HumanMessage(
            content=[
                {
                    "type": "text", 
                    "text": """You are a minimalist illustrator. 
                    Describe this sketch and write a simple prompt for an AI to turn it into a 
                    CLEAN, MINIMALIST DOODLE or SIMPLE FLAT CARTOON. 
                    Use keywords like: 'flat color', 'simple lines', 'white background', 'minimalist', 'marker drawing'.
                    Do NOT use words like 'cinematic', 'detailed', or 'realistic'.
                    ONLY return the prompt."""
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                },
            ]
        )

        response = llm.invoke([message])
        return response.content
    except Exception as e:
        print(f"[LLM ERROR] Vision model failed: {e}")
        # Fallback: use text-only model with a generic prompt
        print("[LLM FALLBACK] Using text-only fallback prompt...")
        try:
            fallback_llm = ChatGroq(
                model="llama-3.3-70b-versatile",
                timeout=30,
            )
            fallback_message = HumanMessage(
                content="Generate a creative, detailed prompt for an AI image generation model. The prompt should describe a beautiful, abstract digital artwork with vibrant colors, flowing shapes, and ethereal lighting. ONLY return the prompt, no other text."
            )
            fallback_response = fallback_llm.invoke([fallback_message])
            return fallback_response.content
        except Exception as fallback_err:
            print(f"[LLM ERROR] Fallback also failed: {fallback_err}")
            raise RuntimeError(f"All LLM attempts failed. Original error: {e}") from e