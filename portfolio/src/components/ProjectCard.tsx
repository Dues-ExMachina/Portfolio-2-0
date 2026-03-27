"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
import Button from "./Button";

interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    image: string;
    githubUrl?: string;
    projectUrl?: string;
    number?: string;
    featured?: boolean;
    category?: string;
}

const tagColors: Record<string, string> = {
    Python: "text-cyan border-cyan/30",
    LangChain: "text-violet border-violet/30",
    RAG: "text-coral border-coral/30",
    "Next.js": "text-text-primary border-navy-border",
    FastAPI: "text-cyan border-cyan/30",
    TypeScript: "text-cyan border-cyan/30",
    Agents: "text-violet border-violet/30",
    Diffusion: "text-orange border-orange/30",
    LLM: "text-coral border-coral/30",
    Docker: "text-text-muted border-navy-border",
    AWS: "text-orange border-orange/30",
    "Hugging Face": "text-text-primary border-navy-border",
    LangGraph: "text-violet border-violet/30",
    Pinecone: "text-cyan border-cyan/30",
    "Stable Diffusion": "text-text-primary border-navy-border",
};

export default function ProjectCard({
    title,
    description,
    tags,
    image,
    githubUrl,
    projectUrl,
    number,
    featured = false,
    category,
}: ProjectCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`group relative bg-navy-card border rounded-sm overflow-hidden transition-all duration-500 ${featured
                ? "border-coral/50 shadow-[0_0_40px_rgba(255,61,90,0.15)] ring-1 ring-coral/30"
                : "border-navy-border hover:border-coral/40 hover:shadow-[0_0_40px_rgba(255,61,90,0.1)]"
                }`}
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-4/3">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-card via-transparent to-transparent" />

                {/* Top-right controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {githubUrl && (
                        <Link
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-sm bg-navy/80 backdrop-blur-sm border border-navy-border flex items-center justify-center text-text-muted hover:text-white transition-colors"
                            aria-label="View on GitHub"
                        >
                            <Github size={14} />
                        </Link>
                    )}
                    {projectUrl && (
                        <Link
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-sm bg-navy/80 backdrop-blur-sm border border-navy-border flex items-center justify-center text-text-muted hover:text-cyan transition-colors"
                            aria-label="View project"
                        >
                            <ExternalLink size={14} />
                        </Link>
                    )}
                </div>

                {featured && (
                    <div
                        className="absolute top-3 left-3 px-2 py-1 bg-coral text-white text-[9px] tracking-widest uppercase"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Featured
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        {category && (
                            <p
                                className="text-text-label text-[10px] uppercase tracking-[0.25em] mb-1"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                {category}
                            </p>
                        )}
                        <h3
                            className="text-text-primary font-bold text-lg leading-tight"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            {title}
                        </h3>
                    </div>
                    {number && (
                        <span
                            className="text-text-label text-xs ml-3 shrink-0"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            {number}
                        </span>
                    )}
                </div>

                <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className={`px-2 py-0.5 text-[10px] border rounded-full ${tagColors[tag] || "text-text-muted border-navy-border"
                                }`}
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <Button variant="primary" size="sm" href={projectUrl || githubUrl || "#"} external>
                    View Project →
                </Button>
            </div>
        </motion.div>
    );
}
