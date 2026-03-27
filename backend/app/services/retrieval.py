from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()


def search_portfolio(query: str) -> str:
    """
    Searches the Pinecone vector index for portfolio context relevant to the query.
    Returns a formatted string of matching chunks, or an empty string on failure.
    """
    api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME")

    if not api_key or not index_name:
        return ""

    # Connect to Pinecone and get the index
    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)

    # Search using integrated embeddings (Pinecone handles embedding the query)
    result = index.search(
        namespace="agent",
        query={"inputs": {"text": query}, "top_k": 3},
        fields=["text", "section"]
    )

    # Pinecone SDK v8+ returns a response object — hits live at result.result.hits
    hits = result.result.hits if hasattr(result, "result") else []

    if not hits:
        return "No relevant info found"

    # Format each hit into a readable [section] text chunk
    formatted_chunks = []
    for match in hits:
        fields = match.fields if hasattr(match, "fields") else match.get("fields", {})

        # match.fields is always a plain dict in the current SDK
        if isinstance(fields, dict):
            text = fields.get("text", "")
            section = fields.get("section", "")
        else:
            text = getattr(fields, "text", "") or ""
            section = getattr(fields, "section", "") or ""

        if text:
            formatted_chunks.append(f"[{section}] {text}")

    return "\n\n".join(formatted_chunks) if formatted_chunks else "No relevant info found"