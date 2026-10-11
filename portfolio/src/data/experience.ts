export interface Experience {
    role: string;
    company: string;
    url?: string;
    image?: string;
    location: string;
    years: string;
    desc: string;
    highlights: string[];
    stack: string[];
}

export const experiences: Experience[] = [
    {
        role: "Software Developer (Intern)",
        company: "AIVOA.ai",
        url: "https://aivoa.ai/",
        image: "/work.png",
        location: "Bangalore, India · Remote",
        years: "April 2026 — Present",
        desc: "Building an agentic, AI-powered eQMS (electronic Quality Management System) for pharmaceutical / GxP clients, where output accuracy, traceability and regulatory compliance are core requirements.",
        highlights: [
            "Developed a 5-stage Temporal workflow orchestrating LLM-powered investigation analysis for the Non-Conformance module, with an iterative self-critique loop that scores each response against a 10-point quality rubric.",
            "Built an autonomous documentation agent (Browser Use, Playwright, LangGraph) that crawls the platform and structures content into a navigation knowledge base feeding a Pinecone-backed RAG pipeline.",
            "Designed a context-isolated session architecture for the AI chat assistant, enabling multi-record conversational workflows across QMS record types.",
            "Built a Python calculation engine for cleaning-validation limits (Maximum Allowable Carryover) — HBEL/PDE, dose-based, 10ppm and LD50/NOEL methods per FDA/EMA/PIC/S/WHO — plus a worst-case-product ranking engine.",
            "Built a recursive PostgreSQL CTE-based traceability graph with React Flow/Dagre visualization and role-based access control, replacing a slower Python-level traversal.",
            "Architected a 9-stage Supplier Corrective Action Request (SCAR) workflow end-to-end, including seed datasets and a Jinja2/WeasyPrint HTML-to-PDF report pipeline.",
        ],
        stack: ["LangGraph", "Temporal", "Pinecone", "FastAPI", "PostgreSQL", "React Flow", "Playwright", "Browser Use"],
    },
];

// Short, scannable highlights for the home / projects spotlight.
export const currentRoleHighlights = [
    { stat: "5-stage", label: "Temporal LLM investigation workflow with self-critique against a 10-point rubric" },
    { stat: "Agentic", label: "Documentation agent (Browser Use + Playwright + LangGraph) feeding a Pinecone RAG pipeline" },
    { stat: "GxP", label: "Cleaning-validation engine (HBEL/PDE, 10ppm, LD50/NOEL) per FDA / EMA / PIC/S / WHO" },
    { stat: "9-stage", label: "SCAR workflow end-to-end, with Jinja2/WeasyPrint PDF reporting" },
];
