"use client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";

const LIVE_URL = "https://ycloude.com";

const MODULES = ["AI Support", "Team Ops", "Workspace", "Billing", "Analytics"];

const HIGHLIGHTS = [
    "RAG pipelines that pull context from uploaded documents and URLs, with Pinecone as the vector store",
    "LangGraph-orchestrated AI assistants alongside real-time team chat",
    "One platform for RAG chatbots, workspace collaboration, time tracking and billing",
    "Built-in analytics, deployed and live for real users",
];

const STACK = ["LangGraph", "Pinecone", "RAG", "FastAPI", "React"];

/** Spotlight on Y Cloude — Anubhab's live, deployed Generative AI workspace. */
export default function PortfolioSpotlight() {
    return (
        <section className="py-24 md:py-32 bg-navy">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
                    {/* Left content */}
                    <AnimatedSection delay={0.1} className="order-2 lg:order-1">
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            <span className="relative flex w-2 h-2">
                                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                            </span>
                            · Live Product · ycloude.com
                        </p>
                        <h2
                            className="text-4xl md:text-5xl font-bold leading-tight mb-5"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Y Cloude: <span className="text-gradient-coral">AI Workspace Platform</span>
                        </h2>
                        <p className="text-text-muted text-base leading-relaxed mb-6">
                            A deployed Generative AI workspace that helps startups run their operations in one
                            place — combining RAG-powered AI assistants with real-time collaboration, time
                            tracking, billing and analytics.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {MODULES.map((m) => (
                                <span
                                    key={m}
                                    className="px-3 py-1 text-[10px] uppercase tracking-widest border border-coral/30 text-coral/90 rounded-sm"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {m}
                                </span>
                            ))}
                        </div>

                        <ul className="space-y-2.5 mb-8">
                            {HIGHLIGHTS.map((h) => (
                                <li key={h} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2 shrink-0" />
                                    {h}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-2 flex-wrap mb-8">
                            {STACK.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-[10px] border border-navy-border text-text-muted rounded-full"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button href={LIVE_URL} external variant="primary">
                                Visit Live Site ↗
                            </Button>
                            <Button href="/projects" variant="ghost">
                                All Projects
                            </Button>
                        </div>
                    </AnimatedSection>

                    {/* Right — product screenshot in a browser frame */}
                    <AnimatedSection delay={0.2} className="order-1 lg:order-2">
                        <motion.a
                            href={LIVE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.3 }}
                            className="group block relative rounded-md overflow-hidden border border-navy-border hover:border-coral/40 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-colors"
                        >
                            {/* Browser chrome */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-navy-card border-b border-navy-border">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                                <span
                                    className="ml-3 flex-1 max-w-xs px-3 py-0.5 rounded bg-navy text-text-label text-[10px] truncate"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    ycloude.com
                                </span>
                            </div>
                            <img
                                src="/ycloude.png"
                                alt="Y Cloude landing page — Run startup ops in one place"
                                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </motion.a>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
