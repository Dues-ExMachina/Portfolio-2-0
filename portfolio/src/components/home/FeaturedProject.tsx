"use client";

import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Button from "@/components/Button";
import { Brush, Eraser, Undo2, Trash2, Sparkles, Download, Pencil, Eye } from "lucide-react";

const COLORS = ["#FF3D5A", "#00C8FF", "#8B5CF6", "#F0F4FF"];
const MAX_UNDO = 25;
const SOURCE_URL = "https://github.com/Dues-ExMachina/Portfolio-2-0";

const PIPELINE = [
    { step: "01", title: "Sketch", desc: "You draw on the canvas" },
    { step: "02", title: "Vision LLM", desc: "Qwen3 vision model (on Groq) reads the sketch and writes a prompt" },
    { step: "03", title: "Diffusion", desc: "FLUX.1 [schnell] on Hugging Face renders the artwork" },
];

const LOADING_STAGES = ["Reading your sketch…", "Writing an art prompt…", "Painting with FLUX…", "Almost there…"];

export default function FeaturedProject() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const undoStack = useRef<ImageData[]>([]);

    const [tool, setTool] = useState<"brush" | "eraser">("brush");
    const [color, setColor] = useState(COLORS[0]);
    const [brushSize, setBrushSize] = useState(4);
    const [isEmpty, setIsEmpty] = useState(true);
    const [canUndo, setCanUndo] = useState(false);

    const [loading, setLoading] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState<string | null>(null);
    const [showSketch, setShowSketch] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ---------- High-DPI canvas that survives resizes ---------- */

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const { width, height } = container.getBoundingClientRect();
            if (!width || !height) return;

            // Keep the current drawing while resizing
            const snapshot = document.createElement("canvas");
            snapshot.width = canvas.width;
            snapshot.height = canvas.height;
            if (canvas.width && canvas.height) snapshot.getContext("2d")?.drawImage(canvas, 0, 0);

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (snapshot.width && snapshot.height) ctx.drawImage(snapshot, 0, 0, width, height);
            undoStack.current = [];
            setCanUndo(false);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        return () => ro.disconnect();
    }, []);

    /* ---------- Pointer helpers (mouse, touch & pen) ---------- */

    const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const pushUndo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
        setCanUndo(true);
    };

    const strokeTo = (from: { x: number; y: number }, to: { x: number; y: number }) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
        ctx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
        ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = tool === "eraser" ? 0 : 8;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    };

    const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (loading) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        pushUndo();
        drawing.current = true;
        const pos = getPos(e);
        lastPos.current = pos;
        strokeTo(pos, pos); // allow single-click dots
        setIsEmpty(false);
        setGeneratedImage(null);
        setAiPrompt(null);
    };

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing.current || !lastPos.current) return;
        const pos = getPos(e);
        strokeTo(lastPos.current, pos);
        lastPos.current = pos;
    };

    const stopDraw = () => {
        drawing.current = false;
        lastPos.current = null;
    };

    /* ---------- Undo / clear ---------- */

    const isCanvasBlank = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return true;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < data.length; i += 16) if (data[i] !== 0) return false;
        return true;
    };

    const undo = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const prev = undoStack.current.pop();
        if (!canvas || !ctx || !prev) return;
        ctx.putImageData(prev, 0, 0);
        setCanUndo(undoStack.current.length > 0);
        setIsEmpty(isCanvasBlank());
        setGeneratedImage(null);
        setAiPrompt(null);
    }, []);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        if (!isEmpty) pushUndo();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        setIsEmpty(true);
        setGeneratedImage(null);
        setAiPrompt(null);
    };

    // Ctrl/Cmd + Z
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target?.closest("input, textarea, [contenteditable]")) return;
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
                if (undoStack.current.length) {
                    e.preventDefault();
                    undo();
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [undo]);

    /* ---------- Generate ---------- */

    useEffect(() => {
        if (!loading) return;
        setElapsed(0);
        const t = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [loading]);

    const exportDrawing = async () => {
        const canvas = canvasRef.current;
        if (!canvas || isEmpty || loading) return;

        // Flatten onto white so the vision model sees a clean sketch
        const temp = document.createElement("canvas");
        temp.width = canvas.width;
        temp.height = canvas.height;
        const tctx = temp.getContext("2d");
        if (tctx) {
            tctx.fillStyle = "#FFFFFF";
            tctx.fillRect(0, 0, temp.width, temp.height);
            tctx.drawImage(canvas, 0, 0);
        }

        setLoading(true);
        setGeneratedImage(null);
        setAiPrompt(null);
        setShowSketch(false);
        setError(null);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: temp.toDataURL("image/png") }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error("Generation failed:", data.error);
                setError(
                    res.status === 504
                        ? "The model took too long to respond. Free GPUs get busy — try again in a minute."
                        : "The AI service is waking up or busy right now. Please try again in a few seconds."
                );
                return;
            }

            if (data.image_url) {
                setGeneratedImage(data.image_url);
                setAiPrompt(typeof data.prompt === "string" ? data.prompt : null);
            } else {
                setError("No image came back from the model. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Couldn't reach the AI service. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), 8000);
        return () => clearTimeout(timer);
    }, [error]);

    const showResult = !!generatedImage && !loading && !showSketch;
    const stage = LOADING_STAGES[Math.min(Math.floor(elapsed / 6), LOADING_STAGES.length - 1)];

    return (
        <section className="py-24 md:py-32 bg-navy-secondary">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* ---------- Canvas ---------- */}
                    <AnimatedSection delay={0.1}>
                        <div className="relative">
                            <div
                                ref={containerRef}
                                className="w-full aspect-square relative overflow-hidden rounded-sm border border-navy-border"
                                style={{ background: "linear-gradient(135deg, #0C1535, #080F28)", maxHeight: "80vh" }}
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

                                {/* Generated image */}
                                <AnimatePresence>
                                    {showResult && (
                                        <motion.img
                                            key={generatedImage}
                                            src={generatedImage!}
                                            alt="AI-generated artwork from your sketch"
                                            initial={{ opacity: 0, scale: 1.04 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6 }}
                                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                            style={{ zIndex: 25 }}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Drawing canvas */}
                                <canvas
                                    ref={canvasRef}
                                    aria-label="Drawing canvas"
                                    className="absolute inset-0 w-full h-full"
                                    style={{
                                        zIndex: 20,
                                        cursor: tool === "eraser" ? "cell" : "crosshair",
                                        touchAction: "none",
                                        opacity: showResult ? 0 : 1,
                                        pointerEvents: showResult || loading ? "none" : "auto",
                                        transition: "opacity 0.4s ease",
                                    }}
                                    onPointerDown={startDraw}
                                    onPointerMove={draw}
                                    onPointerUp={stopDraw}
                                    onPointerCancel={stopDraw}
                                    onPointerLeave={stopDraw}
                                />

                                {/* Result controls */}
                                {generatedImage && !loading && (
                                    <div className="absolute top-8 right-8 z-40 flex gap-2">
                                        <ToolbarButton
                                            label={showSketch ? "Show artwork" : "Show my sketch"}
                                            onClick={() => setShowSketch((s) => !s)}
                                        >
                                            {showSketch ? <Eye size={14} /> : <Pencil size={14} />}
                                        </ToolbarButton>
                                        <a
                                            href={generatedImage}
                                            download="neural-canvas.jpg"
                                            title="Download artwork"
                                            aria-label="Download artwork"
                                            className="w-8 h-8 flex items-center justify-center rounded-sm text-white/60 hover:text-coral transition-colors"
                                            style={{ background: "rgba(8,15,40,0.85)", border: "1px solid rgba(255,61,90,0.25)" }}
                                        >
                                            <Download size={14} />
                                        </a>
                                    </div>
                                )}

                                {/* Loading overlay */}
                                {loading && (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 40 }}>
                                        <motion.div
                                            initial={{ top: "-2px" }}
                                            animate={{ top: "100%" }}
                                            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                                            className="absolute left-0 w-full h-[2px]"
                                            style={{
                                                background: "linear-gradient(90deg, transparent, rgba(255,61,90,0.9), transparent)",
                                                boxShadow: "0 0 12px rgba(255,61,90,0.8)",
                                            }}
                                        />
                                        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(255,61,90,0.08), transparent 70%)" }} />
                                        <div
                                            className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-sm text-[10px] text-coral uppercase tracking-widest whitespace-nowrap"
                                            style={{ fontFamily: "var(--font-space-mono)", background: "rgba(8,15,40,0.85)", border: "1px solid rgba(255,61,90,0.25)" }}
                                        >
                                            {stage} <span className="text-white/40">{elapsed}s</span>
                                        </div>
                                    </div>
                                )}

                                {/* Error overlay */}
                                <AnimatePresence>
                                    {error && !loading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{ zIndex: 45, background: "rgba(8,15,40,0.88)", backdropFilter: "blur(4px)" }}
                                        >
                                            <div className="text-center px-6 max-w-xs">
                                                <p className="text-coral text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                    Generation failed
                                                </p>
                                                <p className="text-white/60 text-sm leading-relaxed mb-5">{error}</p>
                                                <div className="flex items-center justify-center gap-4">
                                                    <button
                                                        onClick={exportDrawing}
                                                        className="text-[10px] text-coral uppercase tracking-widest border border-coral/50 px-3 py-1.5 hover:bg-coral hover:text-white transition-colors"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        Retry
                                                    </button>
                                                    <button
                                                        onClick={() => setError(null)}
                                                        className="text-[10px] text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Empty state */}
                                {isEmpty && !loading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-3 px-6 text-center">
                                        <Brush size={22} className="text-coral/50" />
                                        <span className="text-coral/70 text-xs uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-space-mono)" }}>
                                            Draw something here
                                        </span>
                                        <span className="text-white/30 text-[11px]" style={{ fontFamily: "var(--font-space-mono)" }}>
                                            Try a cat, a house, a rocket or a tree
                                        </span>
                                    </div>
                                )}

                                {/* Toolbar */}
                                <div
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-2.5 py-2 rounded-sm max-w-[calc(100%-40px)] overflow-x-auto"
                                    style={{ background: "rgba(8,15,40,0.9)", border: "1px solid rgba(255,61,90,0.25)", backdropFilter: "blur(8px)" }}
                                >
                                    <ToolbarButton label="Brush" active={tool === "brush"} onClick={() => setTool("brush")}>
                                        <Brush size={14} />
                                    </ToolbarButton>
                                    <ToolbarButton label="Eraser" active={tool === "eraser"} onClick={() => setTool("eraser")}>
                                        <Eraser size={14} />
                                    </ToolbarButton>

                                    <Divider />

                                    {COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setColor(c);
                                                setTool("brush");
                                            }}
                                            aria-label={`Colour ${c}`}
                                            title="Brush colour"
                                            className="w-5 h-5 rounded-full shrink-0 transition-transform hover:scale-110"
                                            style={{
                                                background: c,
                                                boxShadow: color === c && tool === "brush" ? `0 0 0 2px #080F28, 0 0 0 3.5px ${c}` : "none",
                                            }}
                                        />
                                    ))}

                                    <Divider />

                                    <input
                                        type="range"
                                        min={1}
                                        max={14}
                                        value={brushSize}
                                        onChange={(e) => setBrushSize(Number(e.target.value))}
                                        aria-label="Brush size"
                                        title={`Brush size: ${brushSize}`}
                                        className="w-16 accent-[#FF3D5A] shrink-0"
                                    />

                                    <Divider />

                                    <ToolbarButton label="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
                                        <Undo2 size={14} />
                                    </ToolbarButton>
                                    <ToolbarButton label="Clear canvas" onClick={clearCanvas} disabled={isEmpty}>
                                        <Trash2 size={14} />
                                    </ToolbarButton>

                                    <Divider />

                                    <button
                                        onClick={exportDrawing}
                                        disabled={isEmpty || loading}
                                        title={isEmpty ? "Draw something first" : "Generate artwork"}
                                        className="flex items-center gap-1.5 px-3 h-8 shrink-0 text-[10px] uppercase tracking-widest text-white rounded-sm transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
                                        style={{ fontFamily: "var(--font-space-mono)", background: "linear-gradient(135deg, #FF3D5A, #FF6B35)" }}
                                    >
                                        <Sparkles size={12} />
                                        {loading ? "Working" : "Generate"}
                                    </button>
                                </div>

                                {/* Frame corners */}
                                <div className="absolute inset-2 border border-coral/20 pointer-events-none z-30" />
                                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-coral pointer-events-none z-30" />
                                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-coral pointer-events-none z-30" />
                                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-coral pointer-events-none z-30" />
                                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-coral pointer-events-none z-30" />
                            </div>

                            {/* AI prompt that produced the image */}
                            <AnimatePresence>
                                {aiPrompt && !loading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-3 border border-navy-border bg-navy-card rounded-sm px-4 py-3"
                                    >
                                        <p className="text-text-label text-[10px] uppercase tracking-[0.25em] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                            Prompt written by the vision LLM
                                        </p>
                                        <p className="text-text-muted text-xs leading-relaxed line-clamp-3">{aiPrompt}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </AnimatedSection>

                    {/* ---------- Description ---------- */}
                    <AnimatedSection delay={0.2}>
                        <div>
                            <p className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-8" style={{ fontFamily: "var(--font-space-mono)" }}>
                                · Live Demo — Try it
                            </p>

                            <h2
                                className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                            >
                                Neural Canvas: <span className="text-gradient-coral">Sketch to Art</span>
                            </h2>

                            <p className="text-text-muted text-base leading-relaxed mb-8">
                                Draw anything on the canvas and hit <span className="text-coral">Generate</span>. A
                                multimodal pipeline looks at your sketch, describes it, and a diffusion model turns
                                it into a finished illustration — usually in 10–30 seconds.
                            </p>

                            {/* Pipeline */}
                            <ol className="space-y-3 mb-8">
                                {PIPELINE.map((p) => (
                                    <li key={p.step} className="flex items-start gap-4">
                                        <span className="text-coral text-[11px] pt-0.5 shrink-0" style={{ fontFamily: "var(--font-space-mono)" }}>
                                            {p.step}
                                        </span>
                                        <div>
                                            <p className="text-text-primary text-sm font-semibold">{p.title}</p>
                                            <p className="text-text-muted text-sm">{p.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>

                            <div className="flex gap-2 flex-wrap mb-8">
                                {["Qwen3 Vision", "Groq", "FLUX.1", "Hugging Face", "FastAPI", "Next.js"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-[10px] border border-navy-border text-text-muted rounded-full"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Button href={SOURCE_URL} external variant="primary">
                                View Source →
                            </Button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}

/* ---------- Small helpers ---------- */

function ToolbarButton({
    label,
    onClick,
    active,
    disabled,
    children,
}: {
    label: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
                background: active ? "rgba(255,61,90,0.2)" : "rgba(8,15,40,0.85)",
                border: active ? "1px solid #FF3D5A" : "1px solid rgba(255,61,90,0.15)",
                color: active ? "#FF3D5A" : "rgba(255,255,255,0.6)",
            }}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="shrink-0" style={{ width: 1, height: 20, background: "rgba(255,61,90,0.2)" }} />;
}
