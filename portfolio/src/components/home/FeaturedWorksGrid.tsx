"use client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

const works = [
    {
        id: "01",
        title: "AI Chatbot MCP",
        category: "AI Tools",
        image: "/FinanaceManager.png",
        color: "from-cyan/20 to-violet/20",
        accent: "#00C8FF",
        featured: false,
    },
    {
        id: "02",
        title: "LangGraph Chatbot",
        category: "AI Agents",
        image: "/agentic-chatbot.png",
        color: "from-violet/20 to-cyan/20",
        accent: "#8B5CF6",
        featured: false,
    },
    {
        id: "03",
        title: "AI Blogger Agent",
        category: "AI Agents",
        image: "/Ai-Blog.png",
        color: "from-coral/20 to-violet/20",
        accent: "#FF3D5A",
        featured: false,
    },
    {
        id: "04",
        title: "Y-Cloude",
        category: "AI Tools",
        image: "/Ai-Blog.png",
        color: "from-coral/20 to-violet/20",
        accent: "#FF3D5A",
        featured: true,
    },
    
];

export default function FeaturedWorksGrid() {
    return (
        <section className="py-24 md:py-32 bg-navy-secondary">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <AnimatedSection className="mb-14">
                    <p
                        className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-4"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        · Selected Work
                    </p>
                    <div className="flex items-center gap-6">
                        <h2
                            className="text-4xl md:text-5xl font-bold text-text-primary"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Featured Projects
                        </h2>
                        <div className="flex-1 h-px bg-navy-border" />
                        <Link
                            href="/projects"
                            className="text-text-muted text-[11px] uppercase tracking-[0.2em] hover:text-coral transition-colors shrink-0"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            View All →
                        </Link>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {works.map((work, idx) => (
                        <motion.div
                            key={work.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ scale: 1.03 }}
                            className={`group relative bg-navy-card border rounded-sm overflow-hidden cursor-pointer transition-all duration-500 ${work.featured
                                ? "lg:-mt-6 border-coral/50 shadow-[0_0_40px_rgba(255,61,90,0.2)] ring-1 ring-coral/30"
                                : "border-navy-border hover:border-coral/40 hover:shadow-[0_0_30px_rgba(255,61,90,0.12)]"
                                }`}
                        >
                            {/* Image placeholder — vivid gradient */}
                            <div
                                className={`relative h-48 bg-linear-to-br ${work.color} overflow-hidden`}
                            >
                                {work.image && (
                                    <img
                                        src={work.image}
                                        alt={work.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                                {/* Abstract grid lines */}
                                <div
                                    className="absolute inset-0 opacity-20 bg-navy/20"
                                    style={{
                                        backgroundImage: `
                      linear-gradient(${work.accent}55 1px, transparent 1px),
                      linear-gradient(90deg, ${work.accent}55 1px, transparent 1px)
                    `,
                                        backgroundSize: "20px 20px",
                                    }}
                                />
                                {/* Glowing orb */}
                                {!work.image && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div
                                            className="w-20 h-20 rounded-full opacity-60"
                                            style={{
                                                background: `radial-gradient(circle, ${work.accent}88, transparent)`,
                                                filter: "blur(20px)",
                                            }}
                                        />
                                    </div>
                                )}
                                {/* Number */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className="text-white/30 text-2xl font-bold"
                                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                                    >
                                        {work.id}
                                    </span>
                                </div>
                                {work.featured && (
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className="px-2 py-0.5 bg-coral text-white text-[9px] uppercase tracking-widest"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            Featured
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <p
                                    className="text-text-label text-[10px] uppercase tracking-[0.25em] mb-1"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {work.category}
                                </p>
                                <h3
                                    className="text-text-primary text-lg font-bold group-hover:text-coral transition-colors"
                                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                                >
                                    {work.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
