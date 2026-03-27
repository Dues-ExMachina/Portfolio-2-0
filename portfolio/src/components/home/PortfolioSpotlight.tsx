"use client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";

export default function PortfolioSpotlight() {
    return (
        <section className="py-24 md:py-32 bg-navy">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left content */}
                    <AnimatedSection delay={0.1}>
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-8"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            · Portfolio
                        </p>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex gap-1.5">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-coral" />
                                ))}
                            </div>
                            <span
                                className="text-text-muted text-[11px] uppercase tracking-widest"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                Anubhab Das
                            </span>
                        </div>
                        <h2
                            className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                            style={{ fontFamily: "'Clash Display', sans-serif", color: "#FF3D5A" }}
                        >
                            Boundless Intelligence: LLM Discovery
                        </h2>
                        <p className="text-text-muted text-base leading-relaxed mb-8">
                            Exploring the frontier of large language models, agentic systems, and multimodal AI.
                            Building systems that reason, create, and learn — pushing the boundaries of what
                            generative AI can accomplish in the real world.
                        </p>
                        <Button href="/projects" variant="primary">
                            Read More →
                        </Button>
                    </AnimatedSection>

                    {/* Right — Large image */}
                    <AnimatedSection delay={0.2}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                            className="relative rounded-sm overflow-hidden"
                        >
                            {/* Vivid generative art placeholder */}
                            <div
                                className="w-full aspect-4/3 relative"
                                style={{
                                    background: "linear-gradient(135deg, #080F28 0%, #0C1535 100%)",
                                }}
                            >
                                {/* Grid */}
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: "linear-gradient(rgba(0,200,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.5) 1px, transparent 1px)",
                                        backgroundSize: "40px 40px",
                                    }}
                                />
                                {/* Central brain/network visualization */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        <div
                                            className="w-48 h-48 rounded-full opacity-30 animate-pulse-glow"
                                            style={{
                                                background: "radial-gradient(circle, rgba(0,200,255,0.6) 0%, rgba(139,92,246,0.4) 40%, transparent 70%)",
                                                filter: "blur(20px)",
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 border border-cyan/40 rounded-full flex items-center justify-center">
                                                <div className="w-14 h-14 border border-violet/40 rounded-full flex items-center justify-center">
                                                    <div className="w-6 h-6 bg-coral rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Orbiting elements */}
                                        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-2 h-2 rounded-full"
                                                style={{
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: `rotate(${deg}deg) translateX(60px) translateY(-50%)`,
                                                    background: i % 2 === 0 ? "#00C8FF" : "#8B5CF6",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {/* Corner decorations */}
                                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-cyan/40" />
                                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-coral/40" />
                            </div>
                            {/* Coral border frame */}
                            <div className="absolute inset-0 border border-navy-border group-hover:border-coral/30 transition-colors duration-300" />
                        </motion.div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
