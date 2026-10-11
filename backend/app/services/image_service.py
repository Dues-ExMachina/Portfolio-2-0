import os
import base64
import io
import random
from urllib.parse import quote

import httpx
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
# Free default: a public Hugging Face Space (runs on HF's free ZeroGPU; HF_TOKEN raises the daily quota)
HF_SPACE = os.getenv("HF_IMAGE_SPACE", "black-forest-labs/FLUX.1-schnell")
# Gemini image model — takes the sketch itself as input (true sketch-to-image). Key: aistudio.google.com/apikey
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
# Recommended free option: Cloudflare Workers AI (free daily allocation) — FLUX.1 [schnell]
CF_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CF_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
CF_IMAGE_MODEL = os.getenv("CLOUDFLARE_IMAGE_MODEL", "@cf/black-forest-labs/flux-1-schnell")
# Free fallback (no key needed). A free token from auth.pollinations.ai removes the watermark.
POLLINATIONS_TOKEN = os.getenv("POLLINATIONS_TOKEN")

# Hugging Face Inference Client — Stable Diffusion XL Base 1.0 (needs Inference Provider credits)
client = InferenceClient(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    token=HF_TOKEN,
) if HF_TOKEN else None


def _to_data_uri(image_bytes: bytes, mime: str = "image/jpeg") -> str:
    return f"data:{mime};base64,{base64.b64encode(image_bytes).decode('utf-8')}"


def _generate_hf(prompt: str, negative_prompt: str) -> str:
    image = client.text_to_image(
        prompt,
        negative_prompt=negative_prompt,
        guidance_scale=8.5,  # Higher guidance makes it follow the 'simple' prompt more strictly
        num_inference_steps=30,  # 30 steps is a good balance of quality and speed
    )
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")  # JPEG is smaller for faster transmission
    return _to_data_uri(buffered.getvalue())


def _generate_hf_space(prompt: str) -> str:
    from gradio_client import Client
    from PIL import Image

    space = Client(HF_SPACE, token=HF_TOKEN) if HF_TOKEN else Client(HF_SPACE)
    result = space.predict(
        prompt=prompt[:1000],
        seed=0,
        randomize_seed=True,
        width=768,
        height=768,
        num_inference_steps=4,
        api_name="/infer",
    )
    image_path = result[0] if isinstance(result, (list, tuple)) else result
    # Spaces return a temp .webp file — convert to JPEG for consistent display/download
    with Image.open(image_path) as img:
        buffered = io.BytesIO()
        img.convert("RGB").save(buffered, format="JPEG", quality=92)
    try:
        os.remove(image_path)
    except OSError:
        pass
    return _to_data_uri(buffered.getvalue())


def _generate_gemini(prompt: str, sketch_b64: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_IMAGE_MODEL}:generateContent"
    instruction = (
        "Redraw this rough hand-drawn sketch as a clean, polished illustration. "
        "Keep the same subject, composition and proportions as the sketch. "
        f"Style and details: {prompt}"
    )
    body = {
        "contents": [{
            "parts": [
                {"text": instruction},
                {"inline_data": {"mime_type": "image/png", "data": sketch_b64}},
            ]
        }],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }
    with httpx.Client(timeout=90) as http:
        resp = http.post(url, headers={"x-goog-api-key": GEMINI_API_KEY}, json=body)
        if resp.status_code >= 400:
            raise RuntimeError(f"Gemini {resp.status_code}: {resp.text[:300]}")
        data = resp.json()
    for cand in data.get("candidates", []):
        for part in (cand.get("content") or {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                mime = inline.get("mimeType") or inline.get("mime_type") or "image/png"
                return f"data:{mime};base64,{inline['data']}"
    raise RuntimeError(f"Gemini returned no image: {str(data)[:300]}")


def _generate_cloudflare(prompt: str) -> str:
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/{CF_IMAGE_MODEL}"
    with httpx.Client(timeout=90) as http:
        resp = http.post(
            url,
            headers={"Authorization": f"Bearer {CF_API_TOKEN}"},
            json={"prompt": prompt[:2000], "steps": 6},
        )
        resp.raise_for_status()
        mime = resp.headers.get("content-type", "").split(";")[0]
        if mime.startswith("image/"):  # some models (e.g. SDXL) return raw bytes
            return _to_data_uri(resp.content, mime)
        data = resp.json()
        image_b64 = (data.get("result") or {}).get("image")
        if not image_b64:
            raise RuntimeError(f"Cloudflare returned no image: {str(data)[:200]}")
        return f"data:image/jpeg;base64,{image_b64}"


def _generate_pollinations(prompt: str) -> str:
    # Anonymous requests only get the basic tier (512px, watermark); a token unlocks more
    size = 768 if POLLINATIONS_TOKEN else 512
    params = f"width={size}&height={size}&seed={random.randint(1, 10**6)}"
    if POLLINATIONS_TOKEN:
        params += "&nologo=true"
    url = f"https://image.pollinations.ai/prompt/{quote(prompt[:900])}?{params}"
    headers = {"Authorization": f"Bearer {POLLINATIONS_TOKEN}"} if POLLINATIONS_TOKEN else {}
    with httpx.Client(timeout=90, follow_redirects=True) as http:
        resp = http.get(url, headers=headers)
        resp.raise_for_status()
        mime = resp.headers.get("content-type", "image/jpeg").split(";")[0]
        if not mime.startswith("image/"):
            raise RuntimeError(f"Pollinations returned {mime}, not an image")
        # Return as a data URI so the frontend can display + download it without CORS issues
        return _to_data_uri(resp.content, mime)


def generate_art(prompt: str, base64_image: str) -> str:
    """
    Takes a prompt from the LLM and the original sketch,
    and generates a minimalist doodle version.
    Provider order (first configured one that works wins):
    Gemini (sketch-to-image, if key) → HF Space FLUX.1-schnell (free) → Cloudflare Workers AI
    → Hugging Face Inference SDXL (needs credits) → Pollinations.
    """

    # 1. Clean the LLM prompt (remove any conversational filler)
    clean_prompt = prompt.replace("Output:", "").strip()

    # 2. Style Injection: keep the model minimalist
    final_prompt = f"A simple minimalist doodle of {clean_prompt}, clean line art, flat design, white background, simple illustration."

    # 3. Negative Prompting (used by SDXL)
    negative_elements = "photorealistic, 3d render, cinematic, shadows, detailed, intricate, textured, messy, dark background, colorful gradients, realistic skin, hyperdetailed"

    print("--- Artist Service ---")
    print(f"Refined Prompt: {final_prompt}")

    errors = []

    if GEMINI_API_KEY and base64_image:
        try:
            return _generate_gemini(clean_prompt, base64_image)
        except Exception as e:
            print(f"[IMAGE SERVICE] Gemini failed, trying next provider: {str(e)[:300]}")
            errors.append(f"Gemini: {str(e)[:120]}")

    try:
        return _generate_hf_space(final_prompt)
    except Exception as e:
        # e.g. ZeroGPU daily quota exhausted or the Space is restarting
        print(f"[IMAGE SERVICE] HF Space failed, trying next provider: {str(e)[:300]}")
        errors.append(f"HF Space: {str(e)[:120]}")

    if CF_ACCOUNT_ID and CF_API_TOKEN:
        try:
            return _generate_cloudflare(final_prompt)
        except Exception as e:
            print(f"[IMAGE SERVICE] Cloudflare failed, trying next provider: {str(e)[:200]}")
            errors.append(f"Cloudflare: {str(e)[:120]}")

    if client:
        try:
            return _generate_hf(final_prompt, negative_elements)
        except Exception as e:
            # e.g. 402 when the monthly free Inference credits run out
            print(f"[IMAGE SERVICE] Hugging Face failed, trying next provider: {str(e)[:200]}")
            errors.append(f"HuggingFace: {str(e)[:120]}")

    try:
        return _generate_pollinations(final_prompt)
    except Exception as e:
        print(f"[IMAGE SERVICE ERROR] Pollinations failed: {e}")
        errors.append(f"Pollinations: {str(e)[:120]}")

    # Our FastAPI router catches RuntimeError and reports it
    raise RuntimeError("Image generation failed — " + " | ".join(errors))
