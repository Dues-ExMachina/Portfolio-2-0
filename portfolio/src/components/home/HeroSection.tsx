"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [showScroll, setShowScroll] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setShowScroll(latest < 100);
    });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.6;
        }
    }, []);

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy"
        >
            {/* ── Animated gradient blobs ── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
                    style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }}
                    animate={{
                        x: ["-10%", "15%", "-5%", "10%", "-10%"],
                        y: ["-15%", "10%", "20%", "-10%", "-15%"],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
                    style={{ background: "radial-gradient(circle, #FF3D5A, transparent 70%)" }}
                    animate={{
                        x: ["10%", "-20%", "5%", "-10%", "10%"],
                        y: ["10%", "-15%", "5%", "20%", "10%"],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute left-1/2 top-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
                    style={{ background: "radial-gradient(circle, #00C8FF, transparent 70%)" }}
                    animate={{
                        x: ["0%", "-25%", "15%", "5%", "0%"],
                        y: ["0%", "20%", "-10%", "15%", "0%"],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* ── Mouse-following glow ── */}
            <div
                className="absolute inset-0 z-1 pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(139,92,246,0.08), rgba(0,200,255,0.03) 40%, transparent 70%)`,
                }}
            />

            {/* ── Vignette overlay ── */}
            <div
                className="absolute inset-0 z-1 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,11,31,0.4) 100%)",
                }}
            />

            {/* ── Hero video ── */}
            <div className="absolute inset-0 z-2 flex items-center justify-center pointer-events-none -translate-y-42 md:-translate-y-26">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] object-contain rounded-2xl"
                    src="/0001-0121.webm"
                />
            </div>

            {/* ── Subtle grid overlay ── */}
            <div
                className="absolute inset-0 z-3 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,61,90,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,90,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* ── Hero text — floats over the 3D scene ── */}
            <div className="relative z-10 text-center px-6 max-w-4xl mt-[100px] md:mt-[260px]">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-text-primary text-[11px] uppercase tracking-[0.3em] mb-4"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    Generative AI Engineer
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[42px] md:text-[76px] lg:text-[90px] font-bold leading-[0.95] tracking-tight text-text-primary"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                    Anubhab
                    <br />
                    <span className="text-gradient-coral">Das</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex items-center justify-center gap-3 mt-2"
                >
                    <span className="w-12 h-px bg-navy-border" />
                    <span className="text-text-muted text-[14px]" style={{ fontFamily: "var(--font-syne)" }}>
                        AI Research · LLM Systems · Creative Tech
                    </span>
                    <span className="w-12 h-px bg-navy-border" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 mb-6 md:mb-16"
                >
                    <a
                        href="/projects"
                        className="relative inline-flex items-center gap-2 px-8 py-4 border border-coral text-coral text-[11px] uppercase tracking-[0.25em] font-bold group overflow-hidden transition-colors duration-300 hover:text-white"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        <span className="absolute inset-0 bg-coral -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        <span className="relative z-10">View My Work →</span>
                    </a>
                    <a
                        href="/contact"
                        className="px-8 py-4 border border-navy-border text-text-muted text-[11px] uppercase tracking-[0.25em] font-bold hover:border-cyan hover:text-cyan transition-colors duration-300"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Get In Touch
                    </a>
                </motion.div>
            </div>

            {/* ── Scroll indicator ── */}
            <motion.div
                className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: showScroll ? 1 : 0 }}
                transition={{ duration: 0.4 }}
            >
                <span
                    className="text-text-label text-[10px] uppercase tracking-[0.3em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    Scroll
                </span>
                <motion.div
                    className="w-px h-10 bg-linear-to-b from-coral to-transparent"
                    animate={{ scaleY: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
}
