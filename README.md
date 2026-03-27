# Portfolio 2.0

Welcome to the master repository for my interactive **Portfolio 2.0**. This project consists of a modern, 3D-enhanced frontend built with Next.js and a powerful AI agent backend built with FastAPI and LangGraph.

## Repository Structure

The project is split into two primary applications:

### 1. [Frontend (Next.js Application)](./portfolio)
A cutting-edge web application showcasing my projects, skills, and experience with interactive 3D elements and a sleek chat interface.
- **Tech Stack**: Next.js 16 (React 19), Tailwind CSS, Framer Motion, Three.js (@react-three/fiber).
- **Features**: Interactive floating chat widget, 3D interactive cursor elements, responsive and animated design layouts.

### 2. [Backend (AI Agent Service)](./backend)
A Python service that powers the "Portfolio Agent" capable of answering questions about my work in real-time.
- **Tech Stack**: FastAPI, LangGraph, Pinecone (Vector Search).
- **Features**: Semantic search across CV and project data, real-time tool calling streams, dynamic content retrieval, and conversational AI flows.

---

## Getting Started

### Prerequisites
- Node.js & npm (for the frontend)
- Python 3+ (for the backend)
- Pinecone & LLM API keys for the backend services

### Running the Frontend
1. Navigate to the frontend directory: \`cd portfolio\`
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run dev\`

### Running the Backend
1. Navigate to the backend directory: \`cd backend\`
2. Create and activate a virtual environment: \`python -m venv venv\` and \`source venv/bin/activate\` (or \`.\venv\Scripts\activate\` on Windows)
3. Install dependencies: \`pip install -r requirements.txt\`
4. Configure your \`.env\` file (use \`backend/.env.example\` as a guide).
5. Run the FastAPI server: \`uvicorn app.main:app --reload\`

---

*This repository is actively maintained and serves as the master codebase for my portfolio presence and interactive agent.*
