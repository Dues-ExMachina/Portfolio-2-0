"use client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

const bottomProjects = [
    {
        title: "AI Chatbot MCP",
        label: "AI Tools",
        image: "/FinanaceManager.png",
        link: "/projects",
        color: "from-cyan/20 to-violet/20",
        accent: "#00C8FF",
        tall: true,
    },
    {
        title: "LangGraph Chatbot",
        label: "AI Agents",
        image: "/agentic-chatbot.png",
        link: "/projects",
        color: "from-violet/20 to-cyan/20",
        accent: "#8B5CF6",
        tall: false,
    },
    {
        title: "AI Blogger Agent",
        label: "AI Agents",
        image: "/Ai-Blog.png",
        link: "/projects",
        color: "from-coral/20 to-violet/20",
        accent: "#FF3D5A",
        tall: false,
    },
    
];

export default function BottomProjectsGrid() {
    return (
        <section className="py-24 md:py-32 bg-navy-secondary">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <AnimatedSection className="mb-14">
                    <div className="flex items-end justify-between">
                        <div>
                            <p
                                className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-3"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                · More Projects
                            </p>
                            <h2
                                className="text-4xl md:text-5xl font-bold text-text-primary"
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                            >
                                Recent Work
                            </h2>
                        </div>
                        <Link
                            href="/projects"
                            className="text-text-muted text-[11px] uppercase tracking-[0.2em] hover:text-coral transition-colors"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            All Projects →
                        </Link>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {bottomProjects.map((project, idx) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ scale: 1.02 }}
                            className={`group relative bg-navy-card border border-navy-border rounded-sm overflow-hidden hover:border-coral/40 hover:shadow-[0_0_30px_rgba(255,61,90,0.1)] transition-all duration-500 ${project.tall ? "md:row-span-2" : ""
                                }`}
                        >
                            <Link href={project.link}>
                                <div
                                    className={`relative bg-linear-to-br ${project.color} overflow-hidden ${project.tall ? "h-80 md:h-full md:min-h-[420px]" : "h-56"
                                        }`}
                                >
                                    {project.image && (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                    <div
                                        className="absolute inset-0 opacity-20 bg-navy/20"
                                        style={{
                                            backgroundImage: `linear-gradient(${project.accent}44 1px, transparent 1px), linear-gradient(90deg, ${project.accent}44 1px, transparent 1px)`,
                                            backgroundSize: "25px 25px",
                                        }}
                                    />
                                    {!project.image && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="w-24 h-24 rounded-full opacity-50"
                                                style={{
                                                    background: `radial-gradient(circle, ${project.accent}99, transparent)`,
                                                    filter: "blur(25px)",
                                                }}
                                            />
                                        </div>
                                    )}
                                    {/* Corner decoration */}
                                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-white/20" />
                                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-white/20" />
                                </div>

                                <div className="p-5 flex items-center justify-between">
                                    <div>
                                        <p
                                            className="text-text-label text-[10px] uppercase tracking-[0.25em] mb-1"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {project.label}
                                        </p>
                                        <h3
                                            className="text-text-primary font-bold text-xl group-hover:text-coral transition-colors"
                                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                                        >
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div className="w-8 h-8 rounded-sm border border-navy-border flex items-center justify-center text-text-muted group-hover:border-coral group-hover:text-coral transition-colors">
                                        →
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
