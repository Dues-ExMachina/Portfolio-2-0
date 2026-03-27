from app.services.llm import get_llm
from app.agent import run_agent_pipeline
from typing import List, Dict, Generator
import json


def get_chat_response(message: str, history: List[Dict]) -> Generator[str, None, None]:
    """
    Streams chat responses as SSE-formatted strings.
    Runs the LangGraph agent pipeline (intent → route → execute tools),
    then streams the LLM answer token-by-token.
    """
    llm = get_llm()

    # Run intent classifier → tool router → tool executor
    tools_used, formatted_messages = run_agent_pipeline(message, history)

    # Map internal tool names to friendly display names
    tool_display = {
        "pinecone_retrieval": "Pinecone",
        "github_live": "GitHub",
        "web_fetch": "Web",
        "profile_tool": "Profile",
    }
    friendly_tools = [tool_display.get(t, t) for t in tools_used]

    # Tell frontend which tools were used before streaming begins
    yield f"data: {json.dumps({'type': 'tools', 'tools': friendly_tools})}\n\n"

    # Stream the answer token-by-token
    for chunk in llm.stream(formatted_messages):
        if hasattr(chunk, "content") and chunk.content:
            yield f"data: {json.dumps({'type': 'text', 'token': chunk.content})}\n\n"

    # Signal stream completion
    yield "data: [DONE]\n\n"