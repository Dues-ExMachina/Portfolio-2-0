

"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import React, { useRef, useState, useEffect } from "react";
import Button from "@/components/Button";

export default function FeaturedProject() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    const [tool, setTool] = useState<"brush" | "eraser">("brush");
    const [brushSize, setBrushSize] = useState(3);
    const [isEmpty, setIsEmpty] = useState(true);

    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    /* ---------- Setup High DPI Canvas ---------- */

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext("2d");
        ctx?.scale(dpr, dpr);
    }, []);

    /* ---------- Get Cursor Position ---------- */

    const getPos = (
        e: React.MouseEvent | React.TouchEvent,
        canvas: HTMLCanvasElement
    ) => {
        const rect = canvas.getBoundingClientRect();

        if ("touches" in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    /* ---------- Drawing Logic ---------- */

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        drawing.current = true;
        lastPos.current = getPos(e, canvas);

        // Clear AI image when user starts drawing again
        setGeneratedImage(null);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx || !lastPos.current) return;

        e.preventDefault();

        const pos = getPos(e, canvas);

        ctx.globalCompositeOperation =
            tool === "eraser" ? "destination-out" : "source-over";

        ctx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : "#FF3D5A";

        ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.shadowBlur = tool === "eraser" ? 0 : 8;
        ctx.shadowColor = "#FF3D5A";

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        lastPos.current = pos;
        setIsEmpty(false);
    };

    const stopDraw = () => {
        drawing.current = false;
        lastPos.current = null;
    };

    /* ---------- Clear Canvas ---------- */

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
        setGeneratedImage(null);
    };

    /* ---------- Export Drawing ---------- */

    const exportDrawing = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // --- Create a temporary canvas with white background ---
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");

        if (tempCtx) {
            tempCtx.fillStyle = "#FFFFFF";
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
        }

        const image = tempCanvas.toDataURL("image/png");

        setLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Show the backend error message to the user
                setError(data.error || `Generation failed (${res.status})`);
                return;
            }

            if (data.image_url) {
                setGeneratedImage(data.image_url);
            } else {
                setError("No image was returned from the server.");
            }
        } catch (err) {
            console.error(err);
            setError("Network error. Is the backend server running?");
        } finally {
            setLoading(false);
        }
    };

    // Auto-dismiss error after 6 seconds
    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), 6000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        <section className="py-24 md:py-32 bg-navy-secondary">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* ---------- Canvas Section ---------- */}

                    <AnimatedSection delay={0.1}>
                        <motion.div whileHover={{ scale: 1.02 }} className="relative">

                            <div
                                ref={containerRef}
                                className="w-full aspect-square lg:aspect-3/4 relative overflow-hidden rounded-sm"
                                style={{
                                    background: "linear-gradient(135deg, #0C1535, #080F28)",
                                    maxHeight: "90vh",
                                }}
                            >

                                {/* Grid */}
                                <div
                                    className="absolute inset-0 opacity-15 pointer-events-none"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(rgba(255,61,90,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,90,0.6) 1px, transparent 1px)",
                                        backgroundSize: "30px 30px",
                                    }}
                                />

                                {/* Generated Image — sits above the canvas (z-30) */}
                                {generatedImage && !loading && (
                                    <motion.img
                                        src={generatedImage}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                        style={{ zIndex: 30 }}
                                    />
                                )}

                                {/* Canvas — hidden when generated image is showing */}
                                <canvas
                                    ref={canvasRef}
                                    className="absolute inset-0 w-full h-full"
                                    style={{
                                        zIndex: 20,
                                        cursor: tool === "eraser" ? "cell" : "crosshair",
                                        touchAction: "none",
                                        // Hide canvas (but keep it in DOM for re-drawing after clear)
                                        opacity: generatedImage && !loading ? 0 : 1,
                                        pointerEvents: generatedImage && !loading ? "none" : "auto",
                                        transition: "opacity 0.4s ease",
                                    }}
                                    onMouseDown={startDraw}
                                    onMouseMove={draw}
                                    onMouseUp={stopDraw}
                                    onMouseLeave={stopDraw}
                                    onTouchStart={startDraw}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDraw}
                                />

                                {/* AI Scan Overlay */}
                                {loading && (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 40 }}>

                                        <motion.div
                                            initial={{ top: "-2px" }}
                                            animate={{ top: "100%" }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.8,
                                                ease: "linear",
                                            }}
                                            className="absolute left-0 w-full h-[2px]"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(255,61,90,0.9), transparent)",
                                                boxShadow: "0 0 12px rgba(255,61,90,0.8)",
                                            }}
                                        />

                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "radial-gradient(circle at center, rgba(255,61,90,0.08), transparent 70%)",
                                            }}
                                        />

                                        <div
                                            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-coral/70 tracking-widest uppercase"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            AI ANALYZING SKETCH
                                        </div>

                                    </div>
                                )}

                                {/* Error Overlay */}
                                {error && !loading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-auto"
                                        style={{
                                            zIndex: 40,
                                            background: "rgba(8,15,40,0.85)",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    >
                                        <div className="text-center px-6 max-w-sm">
                                            <div
                                                className="w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center"
                                                style={{ border: "1.5px solid rgba(255,61,90,0.5)" }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3D5A" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="15" y1="9" x2="9" y2="15" />
                                                    <line x1="9" y1="9" x2="15" y2="15" />
                                                </svg>
                                            </div>
                                            <p
                                                className="text-coral/80 text-xs uppercase tracking-widest mb-2"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                Generation Failed
                                            </p>
                                            <p
                                                className="text-white/50 text-[11px] leading-relaxed mb-4"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {error}
                                            </p>
                                            <button
                                                onClick={() => setError(null)}
                                                className="text-[10px] text-coral/60 uppercase tracking-widest hover:text-coral transition-colors"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Empty State */}
                                {isEmpty && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-3">
                                        <span
                                            className="text-coral/50 text-xs uppercase tracking-[0.25em]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            Draw here
                                        </span>
                                        <span
                                            className="text-white/20 text-[10px] tracking-widest uppercase"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            Neural Canvas
                                        </span>
                                    </div>
                                )}

                                {/* Toolbar (unchanged) */}
                                <div
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-sm"
                                    style={{
                                        background: "rgba(8,15,40,0.85)",
                                        border: "1px solid rgba(255,61,90,0.25)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >

                                    {/* Brush */}
                                    <button
                                        onClick={() => setTool("brush")}
                                        className="w-7 h-7 flex items-center justify-center rounded-sm transition-all"
                                        style={{
                                            background: tool === "brush" ? "rgba(255,61,90,0.2)" : "transparent",
                                            border: tool === "brush" ? "1px solid #FF3D5A" : "1px solid transparent",
                                            color: tool === "brush" ? "#FF3D5A" : "rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                        </svg>
                                    </button>

                                    {/* Size - */}
                                    <button
                                        onClick={() => setBrushSize((s) => Math.max(1, s - 1))}
                                        className="w-6 h-6 flex items-center justify-center rounded-sm text-xs"
                                        style={{
                                            color: "rgba(255,255,255,0.4)",
                                            border: "1px solid rgba(255,61,90,0.15)",
                                        }}
                                    >
                                        −
                                    </button>

                                    {/* Size Indicator */}
                                    <div className="flex items-center justify-center w-8">
                                        <div
                                            className="rounded-full"
                                            style={{
                                                width: `${Math.min(brushSize * 3, 20)}px`,
                                                height: `${Math.min(brushSize * 3, 20)}px`,
                                                background: "#FF3D5A",
                                                opacity: 0.8,
                                            }}
                                        />
                                    </div>

                                    {/* Size + */}
                                    <button
                                        onClick={() => setBrushSize((s) => Math.min(12, s + 1))}
                                        className="w-6 h-6 flex items-center justify-center rounded-sm text-xs"
                                        style={{
                                            color: "rgba(255,255,255,0.4)",
                                            border: "1px solid rgba(255,61,90,0.15)",
                                        }}
                                    >
                                        +
                                    </button>

                                    <div style={{ width: "1px", height: "20px", background: "rgba(255,61,90,0.2)" }} />

                                    {/* Eraser */}
                                    <button
                                        onClick={() => setTool("eraser")}
                                        className="w-7 h-7 flex items-center justify-center rounded-sm transition-all"
                                        style={{
                                            background: tool === "eraser" ? "rgba(255,61,90,0.2)" : "transparent",
                                            border: tool === "eraser" ? "1px solid #FF3D5A" : "1px solid transparent",
                                            color: tool === "eraser" ? "#FF3D5A" : "rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 20H7L3 16l11-11 6 6-3.5 3.5" />
                                            <path d="M6 15L9 18" />
                                        </svg>
                                    </button>

                                    <div style={{ width: "1px", height: "20px", background: "rgba(255,61,90,0.2)" }} />

                                    {/* Clear */}
                                    <button
                                        onClick={clearCanvas}
                                        className="w-7 h-7 flex items-center justify-center rounded-sm"
                                        style={{ color: "rgba(255,255,255,0.4)" }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                        </svg>
                                    </button>

                                    <div style={{ width: "1px", height: "20px", background: "rgba(255,61,90,0.2)" }} />

                                    {/* Generate */}
                                    <button
                                        onClick={exportDrawing}
                                        className="text-[11px] px-2 text-coral uppercase tracking-widest"
                                    >
                                        Generate
                                    </button>

                                </div>

                                {/* Frame Corners */}
                                <div className="absolute inset-2 border border-coral/20 pointer-events-none z-30" />
                                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-coral pointer-events-none z-30" />
                                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-coral pointer-events-none z-30" />
                                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-coral pointer-events-none z-30" />
                                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-coral pointer-events-none z-30" />

                            </div>

                        </motion.div>
                    </AnimatedSection>

                    {/* Right Side Content (unchanged) */}

                    <AnimatedSection delay={0.2}>
                        <div>

                            <p
                                className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-8"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                · Neural Canvas
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
                                Neural Canvas: Generative Art
                            </h2>

                            <p className="text-text-muted text-base leading-relaxed mb-8">
                                Draw something and let AI transform it into a
                                generated artwork using diffusion models.
                            </p>

                            <div className="flex gap-2 flex-wrap mb-8">
                                {[
                                    "Groq",
                                    "HuggingFace",
                                    "SDXL",
                                    "FastAPI",
                                    "Next.js",
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-[10px] border border-navy-border text-text-muted rounded-full"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Button href="/projects" variant="primary">
                                Read More →
                            </Button>

                        </div>
                    </AnimatedSection>

                </div>

            </div>
        </section>
    );
}