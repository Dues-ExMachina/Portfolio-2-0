# Portfolio AI Agent — Backend

A FastAPI backend powering an AI portfolio agent with LangGraph orchestration, Pinecone semantic search, GitHub live data, and streaming SSE responses.

## Tech Stack

- **FastAPI** — API server
- **LangGraph** — agent orchestration (intent → route → tools → answer)
- **Groq (Llama 4)** — LLM for answer generation
- **Pinecone** — vector store for semantic retrieval
- **GitHub REST API** — live repo data
- **SSE (Server-Sent Events)** — token-by-token streaming to frontend

## Project Structure

```
backend/
  app/
    main.py           # FastAPI app + CORS
    agent.py          # LangGraph StateGraph
    tools.py          # 4 MCP tools (Pinecone, GitHub, Web, Profile)
    routes/
      chat.py         # POST /chat streaming endpoint
      generate.py     # POST /generate (image generation)
    services/
      chat_service.py # Orchestrates agent + LLM streaming
      llm.py          # Groq LLM client
      retrieval.py    # Direct Pinecone search (legacy)
      image_service.py
    scripts/
      indexer.py      # Offline indexing script
    mcp/
      server.py       # FastMCP server (optional)
  profile.json        # Your CV data — fill this in!
  .env                # API keys
  .env.example        # Template for env vars
  pyproject.toml      # Dependencies (use uv)
```

## Local Setup

### 1. Install dependencies

```bash
# Using uv (recommended)
uv sync

# Or pip
pip install -e .
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in **all** values in `.env`:
- `GROQ_API_KEY` — from [console.groq.com](https://console.groq.com)
- `PINECONE_API_KEY` + `PINECONE_INDEX_NAME` — from [pinecone.io](https://pinecone.io)
- `GITHUB_TOKEN` — GitHub Personal Access Token (read:public_repo scope)
- `GITHUB_USERNAME` — your GitHub username
- `LANGCHAIN_API_KEY` — from [smith.langchain.com](https://smith.langchain.com) (optional but recommended)

### 3. Fill in profile.json

Edit `profile.json` with your real data. This powers the `profile_tool` and the Pinecone index.

### 4. Run the indexer

Before first use, index your data into Pinecone:

```bash
uv run python -m app.scripts.indexer
```

This is **idempotent** — safe to re-run any time you update `profile.json`.

### 5. Start the server

```bash
uv run uvicorn app.main:app --host 127.0.0.1 --port 8011 --reload
```

Test the `/chat` endpoint:

```bash
curl -X POST http://localhost:8011/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What projects has Anubhab built?", "session_id": "test", "history": []}' \
  --no-buffer
```

## Agent Architecture

```
User message
    │
    ▼
intent_classifier  →  "project" | "skill" | "activity" | "bio" | "general"
    │
    ▼
tool_router        →  picks 2–3 tools based on intent
    │
    ▼
tool_executor      →  calls tools in sequence
   ├── pinecone_retrieval(query)    semantic search over indexed profile
   ├── github_live("repos")         live GitHub repo list
   ├── web_fetch(url)               page content (if URL in message)
   └── profile_tool()               raw profile.json
    │
    ▼
answer_generator   →  assembles context + history → streams from Groq LLM
    │
    ▼
SSE stream to frontend (tools event → tokens → [DONE])
```

## Deployment (Railway / Render)

1. Push the `backend/` folder to a new GitHub repo.
2. Create a new service on [railway.app](https://railway.app) or [render.com](https://render.com).
3. Set all env vars from `.env` in the dashboard.
4. Set the start command:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
5. Deploy. Copy the public URL.
6. Set `NEXT_PUBLIC_AGENT_URL=https://your-backend-url.railway.app` in your Vercel project settings.
7. Re-deploy the frontend on Vercel.

## Re-indexing

Whenever you update `profile.json` or add new projects:

```bash
uv run python -m app.scripts.indexer
```