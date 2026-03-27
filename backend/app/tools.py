# app/tools.py
# The 4 MCP tools available to the LangGraph agent.

import os
import json
import httpx
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# ── 1. Pinecone Retrieval ─────────────────────────────────────────────────────

def pinecone_retrieval(query: str) -> list[dict]:
    """
    Semantic search over the Pinecone index.
    Returns top-5 chunks with source metadata.
    """
    api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME")

    if not api_key or not index_name:
        return [{"error": "Pinecone env vars missing"}]

    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)

    result = index.search(
        namespace="agent",
        query={"inputs": {"text": query}, "top_k": 5},
        fields=["text", "section"],
    )

    hits = result.result.hits if hasattr(result, "result") else []

    chunks = []
    for match in hits:
        fields = match.fields if hasattr(match, "fields") else match.get("fields", {})
        if isinstance(fields, dict):
            text = fields.get("text", "")
            section = fields.get("section", "")
        else:
            text = getattr(fields, "text", "") or ""
            section = getattr(fields, "section", "") or ""

        if text:
            chunks.append({"section": section, "text": text})

    return chunks if chunks else [{"section": "none", "text": "No relevant info found"}]


# ── 2. GitHub Live ────────────────────────────────────────────────────────────

def github_live(endpoint: str) -> dict:
    """
    Wraps GitHub REST API.
    `endpoint` examples:
      - "repos"                  → list public repos
      - "repos/{repo}/readme"    → README of a specific repo
      - "repos/{repo}/languages" → language breakdown
      - "repos/{repo}/commits"   → recent commits
    """
    token = os.getenv("GITHUB_TOKEN")
    username = os.getenv("GITHUB_USERNAME", "Dues-ExMachina")

    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    base = "https://api.github.com"

    # Resolve shorthand endpoints
    if endpoint == "repos":
        url = f"{base}/users/{username}/repos?sort=updated&per_page=10"
    elif endpoint.startswith("repos/"):
        # e.g. "repos/my-project/readme"
        url = f"{base}/{username}/{endpoint}"
    else:
        url = f"{base}/{endpoint}"

    try:
        with httpx.Client(timeout=10) as client:
            resp = client.get(url, headers=headers)
            resp.raise_for_status()
            data = resp.json()

            # Simplify repo list
            if isinstance(data, list) and endpoint == "repos":
                return {
                    "repos": [
                        {
                            "name": r.get("name"),
                            "description": r.get("description"),
                            "language": r.get("language"),
                            "topics": r.get("topics", []),
                            "url": r.get("html_url"),
                            "stars": r.get("stargazers_count"),
                            "updated_at": r.get("updated_at"),
                        }
                        for r in data
                    ]
                }

            # README — decode base64 content
            if isinstance(data, dict) and "content" in data:
                import base64
                raw = data["content"].replace("\n", "")
                try:
                    text = base64.b64decode(raw).decode("utf-8", errors="replace")
                    return {"readme": text[:3000]}  # cap at 3k chars
                except Exception:
                    return {"readme": data["content"]}

            return data

    except httpx.HTTPStatusError as e:
        return {"error": f"GitHub API error {e.response.status_code}: {e.response.text[:200]}"}
    except Exception as e:
        return {"error": str(e)}


# ── 3. Web Fetch ──────────────────────────────────────────────────────────────

def web_fetch(url: str) -> str:
    """
    Fetches the text content of a live deployed URL.
    Strips most HTML tags and returns readable text.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; PortfolioAgent/1.0)"
        }
        with httpx.Client(timeout=12, follow_redirects=True) as client:
            resp = client.get(url, headers=headers)
            resp.raise_for_status()
            content = resp.text

        # Basic HTML stripping
        import re
        # Remove script/style blocks
        content = re.sub(r"<(script|style)[^>]*>.*?</(script|style)>", "", content, flags=re.DOTALL | re.IGNORECASE)
        # Remove all tags
        content = re.sub(r"<[^>]+>", " ", content)
        # Collapse whitespace
        content = re.sub(r"\s+", " ", content).strip()

        return content[:4000]  # cap at 4k chars

    except httpx.HTTPStatusError as e:
        return f"HTTP error {e.response.status_code} fetching {url}"
    except Exception as e:
        return f"Error fetching {url}: {e}"


# ── 4. Profile Tool ───────────────────────────────────────────────────────────

def profile_tool() -> dict:
    """
    Returns the hardcoded profile JSON (skills, education, certifications, contact).
    Loaded from profile.json at runtime so you only need to edit one file.
    """
    profile_path = os.path.join(os.path.dirname(__file__), "..", "profile.json")
    try:
        with open(profile_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "profile.json not found"}
    except json.JSONDecodeError as e:
        return {"error": f"Invalid profile.json: {e}"}
