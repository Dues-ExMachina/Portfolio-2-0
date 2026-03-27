import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

// Static blog posts data
const posts: Record<string, { date: string; category: string; title: string; readTime: string; content: string }> = {
    "building-production-rag": {
        date: "February 2026",
        category: "LLMs",
        title: "Building Production RAG Systems with LlamaIndex",
        readTime: "12 min read",
        content: `
## Introduction

Retrieval-Augmented Generation (RAG) has become the cornerstone of enterprise LLM deployments. Unlike fine-tuning, RAG allows models to access up-to-date, domain-specific knowledge without retraining.

## The Architecture

A production RAG system consists of several key components:

1. **Document Processing Pipeline** — Chunk, clean, and embed your documents
2. **Vector Database** — Store and retrieve embeddings efficiently (Pinecone, Weaviate, Qdrant)
3. **Retrieval Layer** — Hybrid search combining dense + sparse retrieval
4. **Reranking** — Cross-encoder rerankers for precision improvement
5. **Generation** — Prompt the LLM with retrieved context

## Chunking Strategies

Choosing the right chunking strategy dramatically affects retrieval quality:

- **Fixed-size chunking**: Simple but loses context at boundaries
- **Recursive text splitting**: Respects natural text boundaries
- **Semantic chunking**: Groups semantically similar content (best for complex docs)

## Hybrid Search

Combining BM25 (sparse) + embedding search (dense) consistently outperforms either alone. The key is the right fusion strategy — Reciprocal Rank Fusion (RRF) is our recommendation.

## Conclusion

Building production RAG requires careful attention to each pipeline stage. Start simple, measure retrieval quality with RAGAS, and iterate.
    `,
    },
    "llm-agents-architecture": {
        date: "January 2026",
        category: "Agents",
        title: "LLM Agents: From Simple Tools to Complex Workflows",
        readTime: "15 min read",
        content: `
## What Are LLM Agents?

An LLM agent is a system where a language model acts as the reasoning engine, deciding which tools to call, in what order, and how to synthesize results into coherent outputs.

## LangGraph: The Right Abstraction

LangGraph provides a directed graph abstraction for building stateful agent workflows. Nodes represent computation steps, edges represent state transitions.

Key primitives:
- **StateGraph**: Manages agent state across steps
- **Conditional edges**: Route based on LLM decisions
- **Checkpointing**: Save/restore agent state for human-in-the-loop

## Multi-Agent Patterns

The most powerful architectures involve multiple specialized agents:

1. **Orchestrator → Worker**: A planner delegates to specialized sub-agents
2. **Parallel execution**: Fan-out to multiple agents, fan-in results
3. **Debate/critique**: Agents debate each other to improve quality

## Conclusion

Start with simple ReAct-style agents, measure task completion rates, then graduate to multi-agent systems when you hit capability ceilings.
    `,
    },
    "diffusion-models-creative-ai": {
        date: "December 2025",
        category: "Diffusion",
        title: "Diffusion Models and Creative AI: A Practical Guide",
        readTime: "10 min read",
        content: `
## Why Diffusion Models?

Diffusion models have surpassed GANs for image generation due to training stability, sample diversity, and zero-shot compositionality.

## Stable Diffusion Fundamentals

The key insight of latent diffusion: perform the denoising process in a compressed latent space, not pixel space. This reduces compute by 64x without quality loss.

## LoRA Fine-tuning

Low-Rank Adaptation (LoRA) lets you fine-tune Stable Diffusion for specific styles or subjects with just 10-50 images and consumer GPU hardware.

Key hyperparameters:
- **rank**: Lower = less parameters, faster training. Start at 4-8.
- **learning rate**: 1e-4 for UNet, 1e-5 for text encoder
- **steps**: 1000-3000 depending on dataset size

## ControlNet Integration

ControlNet adds conditional control to diffusion models: pose estimation, depth maps, canny edges. Essential for consistent character animation.

## Conclusion

Diffusion models are a creative superpower. Combine LoRA fine-tuning with ControlNet for maximum control over your generative output.
    `,
    },
};

export async function generateStaticParams() {
    return Object.keys(posts).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = posts[params.slug];

    if (!post) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-coral mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                        Post Not Found
                    </h1>
                    <Link href="/blog" className="text-text-muted hover:text-coral transition-colors" style={{ fontFamily: "var(--font-space-mono)" }}>
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-navy border-b border-navy-border">
                <div className="max-w-3xl mx-auto px-6 lg:px-10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-coral transition-colors text-[11px] uppercase tracking-widest mb-10"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        <ArrowLeft size={14} />
                        Back to Writing
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <span
                            className="px-3 py-1 border border-coral/30 text-coral text-[10px] uppercase tracking-widest rounded-full"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            {post.category}
                        </span>
                        <span className="text-text-label text-[11px]" style={{ fontFamily: "var(--font-space-mono)" }}>
                            {post.date}
                        </span>
                        <span className="text-text-label text-[11px]" style={{ fontFamily: "var(--font-space-mono)" }}>
                            · {post.readTime}
                        </span>
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-navy-card border border-navy-border text-coral text-xs font-bold"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            AD
                        </div>
                        <div>
                            <p className="text-text-primary text-sm font-medium">Anubhab Das</p>
                            <p className="text-text-label text-xs" style={{ fontFamily: "var(--font-space-mono)" }}>
                                Generative AI Engineer
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-navy-secondary">
                <div className="max-w-3xl mx-auto px-6 lg:px-10">
                    <div
                        className="prose prose-invert prose-lg max-w-none"
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontSize: "17px",
                            lineHeight: "1.8",
                            color: "#6B7CA8",
                        }}
                    >
                        {post.content.split("\n\n").map((block, i) => {
                            if (block.startsWith("## ")) {
                                return (
                                    <h2
                                        key={i}
                                        className="text-text-primary font-bold text-2xl mt-12 mb-4"
                                        style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "28px", lineHeight: "1.3" }}
                                    >
                                        {block.replace("## ", "")}
                                    </h2>
                                );
                            }
                            if (block.startsWith("- **")) {
                                const items = block.split("\n").filter(Boolean);
                                return (
                                    <ul key={i} className="space-y-2 my-4">
                                        {items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <span className="text-coral mt-2 text-xs">●</span>
                                                <span dangerouslySetInnerHTML={{ __html: item.replace(/- \*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>').replace(/^- /, "") }} />
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }
                            if (block.match(/^\d\./m)) {
                                const items = block.split("\n").filter(Boolean);
                                return (
                                    <ol key={i} className="space-y-2 my-4 list-none">
                                        {items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <span className="text-coral font-mono text-sm shrink-0" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                    {String(j + 1).padStart(2, "0")}
                                                </span>
                                                <span dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>') }} />
                                            </li>
                                        ))}
                                    </ol>
                                );
                            }
                            if (block.trim()) {
                                return (
                                    <p key={i} className="my-4" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>') }} />
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Back */}
                    <div className="mt-16 pt-8 border-t border-navy-border">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-coral text-[11px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors group relative overflow-hidden border border-coral px-6 py-3"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            <span className="absolute inset-0 bg-coral translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
                            <span className="relative z-10 flex items-center gap-2">
                                <ArrowLeft size={12} />
                                Back to Writing
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
