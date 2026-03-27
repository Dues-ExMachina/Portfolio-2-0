"use client";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";

const allProjects = [
    {
        title: "AI Chatbot MCP",
        description: "A high-performance chat interface bridging LLMs with Model Context Protocol (MCP) servers. Features clean UI/UX and multi-server support.",
        tags: ["Python", "Streamlit", "LangChain", "MCP", "Groq"],
        image: "/FinanaceManager.png",
        githubUrl: "https://github.com/dues-exmachina/ai-chatbot-mcp",
        projectUrl: "https://ai-chatbot-mcp-cpwrf58ktxybtxpq8swjku.streamlit.app/",
        category: "Tools",
        featured: true,
    },
    {
        title: "LangGraph Chatbot",
        description: "A multi-turn chatbot application using LangGraph and Gemini. Features conversational memory and tool use for calculations, stock prices, and web search.",
        tags: ["LangGraph", "Gemini", "Python", "Streamlit", "LangChain"],
        image: "/agentic-chatbot.png",
        githubUrl: "https://github.com/dues-exmachina/agentic-chatbot/",
        projectUrl: "https://agentic-chatbot-dues.streamlit.app/",
        category: "Agents",
        featured: false,
    },
    {
        title: "AI Blogger Agent",
        description: "An advanced AI-powered blogging agent that automates the process of researching, planning, and writing high-quality blog posts.",
        tags: ["LangGraph", "FastAPI", "Next.js", "Groq", "Llama-3.1"],
        image: "/Ai-Blog.png",
        githubUrl: "https://github.com/Dues-ExMachina/Ai-Blogger-Agent",
        projectUrl: "https://ai-blogger-agent-beryl.vercel.app/",
        category: "Agents",
        featured: false,
    },
    
];

const filters = ["All", "LLMs", "Agents", "Diffusion", "Tools"];

// Gradient backgrounds for projects (no external images required)
const projectGradients = [
    "linear-gradient(135deg, rgba(255,61,90,0.15), rgba(139,92,246,0.15))",
    "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(0,200,255,0.15))",
    "linear-gradient(135deg, rgba(0,200,255,0.15), rgba(139,92,246,0.1))",
    "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,61,90,0.15))",
    "linear-gradient(135deg, rgba(0,200,255,0.1), rgba(255,61,90,0.1))",
    "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,200,255,0.15))",
];

export default function ProjectsPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered = activeFilter === "All"
        ? allProjects
        : allProjects.filter((p) => p.category === activeFilter);

    return (
        <>
            <section className="pt-32 pb-16 bg-navy">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <AnimatedSection>
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-4"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            · Work
                        </p>
                        <h1
                            className="text-5xl md:text-7xl font-bold text-text-primary mb-6"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Selected Projects
                        </h1>
                        <p className="text-text-muted text-base max-w-xl">
                            A curated collection of AI & generative systems built for production, research, and creative exploration.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Filter tabs */}
            <section className="py-8 bg-navy border-b border-navy-border sticky top-16 z-50 backdrop-blur-md bg-navy/90">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shrink-0 relative ${activeFilter === filter
                                    ? "text-coral"
                                    : "text-text-muted hover:text-text-primary"
                                    }`}
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                {filter}
                                {activeFilter === filter && (
                                    <span className="absolute bottom-0 left-0 right-0 h-px bg-coral" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project grid */}
            <section className="py-16 bg-navy-secondary min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((project, idx) => (
                            <AnimatedSection key={project.title} delay={idx * 0.08}>
                                <div
                                    className={`group relative bg-navy-card border rounded-sm overflow-hidden transition-all duration-500 h-full ${project.featured
                                        ? "border-coral/50 shadow-[0_0_40px_rgba(255,61,90,0.15)] ring-1 ring-coral/30"
                                        : "border-navy-border hover:border-coral/40 hover:shadow-[0_0_40px_rgba(255,61,90,0.1)]"
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div
                                        className="w-full h-48 relative overflow-hidden"
                                        style={{ background: projectGradients[idx % projectGradients.length] }}
                                    >
                                        {project.image && (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                        <div
                                            className="absolute inset-0 opacity-10 bg-navy/20"
                                            style={{
                                                backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                backgroundSize: "20px 20px",
                                            }}
                                        />
                                        {!project.image && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full opacity-40" style={{ background: "radial-gradient(circle, white, transparent)", filter: "blur(20px)" }} />
                                            </div>
                                        )}
                                        {project.featured && (
                                            <div className="absolute top-3 left-3">
                                                <span className="px-2 py-0.5 bg-coral text-white text-[9px] uppercase tracking-widest" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                                className="w-7 h-7 bg-navy/80 backdrop-blur-sm border border-navy-border rounded-sm flex items-center justify-center text-text-muted hover:text-white text-xs">
                                                GH
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <p className="text-text-label text-[10px] uppercase tracking-[0.25em] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                            {project.category}
                                        </p>
                                        <h3 className="text-text-primary font-bold text-xl mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                            {project.title}
                                        </h3>
                                        <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 text-[10px] border border-navy-border text-text-muted rounded-full" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <a
                                            href={project.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn relative inline-flex items-center gap-2 px-4 py-2 border border-coral text-coral text-[10px] uppercase tracking-[0.2em] font-bold overflow-hidden hover:text-white transition-colors duration-300 self-start"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            <span className="absolute inset-0 bg-coral translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-300" />
                                            <span className="relative z-10">View Project →</span>
                                        </a>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
