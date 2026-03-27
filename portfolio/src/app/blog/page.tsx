import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";

const posts = [
    {
        slug: "building-production-rag",
        date: "FEB 2026",
        category: "LLMs",
        title: "Building Production RAG Systems with LlamaIndex",
        excerpt: "A deep dive into architecting retrieval-augmented generation pipelines that actually scale. We cover indexing strategies, chunking methods, hybrid search, and re-ranking.",
    },
    {
        slug: "llm-agents-architecture",
        date: "JAN 2026",
        category: "Agents",
        title: "LLM Agents: From Simple Tools to Complex Workflows",
        excerpt: "Exploring multi-agent architectures with LangGraph — how to build agents that plan, execute, and self-correct in complex, multi-step reasoning tasks.",
    },
    {
        slug: "diffusion-models-creative-ai",
        date: "DEC 2025",
        category: "Diffusion",
        title: "Diffusion Models and Creative AI: A Practical Guide",
        excerpt: "Stable Diffusion, LoRA fine-tuning, and ControlNet explained. How to leverage diffusion models for real creative applications beyond simple text-to-image.",
    },
    {
        slug: "prompt-engineering-patterns",
        date: "NOV 2025",
        category: "LLMs",
        title: "Advanced Prompt Engineering Patterns for Production",
        excerpt: "Beyond chain-of-thought: few-shot prompting, constitutional AI, and systematic prompt versioning strategies for enterprise LLM deployments.",
    },
    {
        slug: "mlops-for-llms",
        date: "OCT 2025",
        category: "MLOps",
        title: "MLOps for LLMs: Monitoring, Evaluation, and Drift Detection",
        excerpt: "Running LLMs in production is hard. This guide covers evaluation frameworks, latency monitoring, cost optimization, and detecting model drift.",
    },
];

const tags = ["RAG", "LLMs", "Diffusion", "Agents", "MLOps", "Prompt Engineering", "LangChain", "Fine-tuning", "LangGraph", "Vector DBs"];

export default function BlogPage() {
    return (
        <>
            <section className="pt-32 pb-16 bg-navy min-h-[70vh] flex flex-col items-center justify-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
                    <AnimatedSection>
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-4"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            · Writing
                        </p>
                        <h1
                            className="text-5xl md:text-7xl font-bold text-text-primary mb-6"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Thoughts on
                            <br />
                            <span className="text-gradient-coral">Generative AI</span>
                        </h1>
                        
                        <div className="mt-16 p-8 border border-coral/20 bg-navy-card rounded-sm inline-block">
                            <h2 
                                className="text-3xl font-bold text-text-primary mb-2" 
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                            >
                                Coming Soon
                            </h2>
                            <p className="text-text-muted text-sm" style={{ fontFamily: "var(--font-space-mono)" }}>
                                Working on some interesting essays. Stay tuned.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/*
            <div className="border-b border-navy-border" />
            <section className="py-16 bg-navy-secondary">
                ... (original content hidden) ...
            </section>
            */}

            <Footer />
        </>
    );
}
