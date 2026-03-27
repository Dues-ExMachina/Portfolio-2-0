# app/agent.py
# LangGraph StateGraph: intent_classifier → tool_router → tool_executor → answer_generator

import os
import json
from typing import TypedDict, Annotated, Literal
from typing import Generator

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END

from app.services.llm import get_llm
from app.tools import pinecone_retrieval, github_live, web_fetch, profile_tool

# ── State ──────────────────────────────────────────────────────────────────────

class AgentState(TypedDict):
    message: str
    history: list[dict]
    intent: str               # "skill" | "project" | "activity" | "bio" | "general"
    tools_to_call: list[str]  # names of tools chosen by tool_router
    tool_results: dict        # keyed by tool name
    tools_used: list[str]     # populated after execution
    context: str              # assembled context for answer_generator


# ── Node 1 — intent_classifier ─────────────────────────────────────────────────

def intent_classifier(state: AgentState) -> AgentState:
    """Classify the query into one of 5 intent buckets."""
    msg = state["message"].lower()

    if any(k in msg for k in ["github", "commit", "repo", "repository", "code", "latest", "recent", "push"]):
        intent = "activity"
    elif any(k in msg for k in ["project", "built", "made", "work", "portfolio", "demo", "live"]):
        intent = "project"
    elif any(k in msg for k in ["skill", "tech", "language", "framework", "stack", "know", "experience", "use", "familiar"]):
        intent = "skill"
    elif any(k in msg for k in ["who", "bio", "about", "background", "education", "study", "degree", "college", "certif"]):
        intent = "bio"
    else:
        intent = "general"

    return {**state, "intent": intent}


# ── Node 2 — tool_router ────────────────────────────────────────────────────────

def tool_router(state: AgentState) -> AgentState:
    """Decide which tools to invoke based on intent."""
    intent = state["intent"]

    routing: dict[str, list[str]] = {
        "activity": ["github_live", "pinecone_retrieval"],
        "project":  ["pinecone_retrieval", "github_live"],
        "skill":    ["profile_tool", "pinecone_retrieval"],
        "bio":      ["profile_tool", "pinecone_retrieval"],
        "general":  ["pinecone_retrieval", "profile_tool"],
    }

    tools = routing.get(intent, ["pinecone_retrieval", "profile_tool"])
    return {**state, "tools_to_call": tools}


# ── Node 3 — tool_executor ─────────────────────────────────────────────────────

def tool_executor(state: AgentState) -> AgentState:
    """Execute chosen tools and gather results."""
    results: dict = {}
    used: list[str] = []
    message = state["message"]

    dispatch = {
        "pinecone_retrieval": lambda: pinecone_retrieval(message),
        "github_live":        lambda: github_live("repos"),
        "web_fetch":          lambda: web_fetch(message),  # only if message contains a URL
        "profile_tool":       lambda: profile_tool(),
    }

    for tool_name in state["tools_to_call"]:
        # Only call web_fetch if message or pinecone results contain a URL
        if tool_name == "web_fetch":
            import re
            urls = re.findall(r"https?://[^\s]+", message)
            if not urls:
                continue

        fn = dispatch.get(tool_name)
        if fn:
            try:
                results[tool_name] = fn()
                used.append(tool_name)
            except Exception as e:
                results[tool_name] = {"error": str(e)}

    return {**state, "tool_results": results, "tools_used": used}


# ── Node 4 — answer_generator ──────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a knowledgeable, concise representative of Anubhab Das — a Generative AI Engineer.
You have deep knowledge of his projects, code, commits, and skills.
Answer in first person on his behalf.

VERY IMPORTANT RULES FOR YOUR RESPONSES:
1. Be EXTREMELY compact and concise. 
2. Use bullet points for readability when listing items.
3. Keep answers to 2-3 short paragraphs maximum.
4. Avoid flowery language or long preambles. Get straight to the point.
5. Be specific — cite actual project names, tech stacks, and commit details when relevant, but do so briefly.
6. Never make up information. If you don't know, say so."""


def _build_context(tool_results: dict) -> str:
    """Convert raw tool results into a readable context string."""
    parts = []

    if "profile_tool" in tool_results:
        profile = tool_results["profile_tool"]
        if isinstance(profile, dict) and "error" not in profile:
            parts.append(f"[Profile]\n{json.dumps(profile, indent=2)}")

    if "pinecone_retrieval" in tool_results:
        chunks = tool_results["pinecone_retrieval"]
        if isinstance(chunks, list):
            chunk_text = "\n\n".join(
                f"[{c.get('section', '')}] {c.get('text', '')}" for c in chunks
            )
            parts.append(f"[Knowledge Base]\n{chunk_text}")

    if "github_live" in tool_results:
        gh = tool_results["github_live"]
        if isinstance(gh, dict) and "repos" in gh:
            repos = gh["repos"][:5]
            repo_text = "\n".join(
                f"- {r['name']}: {r.get('description', 'No description')} "
                f"[{r.get('language', 'N/A')}] {r.get('url', '')}"
                for r in repos
            )
            parts.append(f"[GitHub Repos]\n{repo_text}")

    if "web_fetch" in tool_results:
        web_content = tool_results["web_fetch"]
        if isinstance(web_content, str) and not web_content.startswith("Error"):
            parts.append(f"[Web Content]\n{web_content[:2000]}")

    return "\n\n---\n\n".join(parts) if parts else "No additional context available."


def build_messages(state: AgentState) -> list:
    """Build the full message list for the LLM."""
    context = _build_context(state["tool_results"])

    sys_msg = SystemMessage(
        content=f"{SYSTEM_PROMPT}\n\n"
                f"Use the following context to answer accurately:\n\n{context}\n\n"
                "If context is insufficient, say you don't know."
    )

    msgs = [sys_msg]

    for h in state["history"]:
        role = h.get("role")
        content = h.get("content", "")
        if role == "user":
            msgs.append(HumanMessage(content=content))
        elif role == "assistant":
            msgs.append(AIMessage(content=content))

    msgs.append(HumanMessage(content=state["message"]))
    return msgs


# ── Build the Graph ────────────────────────────────────────────────────────────

def build_agent():
    """Build and compile the LangGraph StateGraph."""
    builder = StateGraph(AgentState)

    builder.add_node("intent_classifier", intent_classifier)
    builder.add_node("tool_router", tool_router)
    builder.add_node("tool_executor", tool_executor)
    # answer_generator is handled outside the graph for streaming

    builder.set_entry_point("intent_classifier")
    builder.add_edge("intent_classifier", "tool_router")
    builder.add_edge("tool_router", "tool_executor")
    builder.add_edge("tool_executor", END)

    return builder.compile()


# Singleton — compiled once at import time
_agent = build_agent()


def run_agent_pipeline(message: str, history: list[dict]) -> tuple[list, list[dict]]:
    """
    Run intent → router → executor.
    Returns (tools_used, formatted_messages_for_llm).
    """
    initial_state: AgentState = {
        "message": message,
        "history": history,
        "intent": "",
        "tools_to_call": [],
        "tool_results": {},
        "tools_used": [],
        "context": "",
    }

    final_state = _agent.invoke(initial_state)
    messages = build_messages(final_state)

    return final_state["tools_used"], messages
