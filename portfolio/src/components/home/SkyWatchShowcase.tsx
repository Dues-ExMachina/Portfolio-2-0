"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";

const REPO_URL = "https://github.com/Dues-ExMachina/SkyWatch-Drone-detection-tracking";

const SHOTS = [
    { key: "drone", label: "Drone tracked", src: "/drone.png", caption: "Drone #1 tracked at 149 px/s, heading W, with its flight path" },
    { key: "bird", label: "Bird ignored", src: "/bird.png", caption: "Bird #85 classified as bird (0.71), so no drone alert fires" },
];

const METRICS = [
    { value: "0.970", label: "mAP50 (test)" },
    { value: "0.956", label: "Precision" },
    { value: "0.919", label: "Recall" },
    { value: "0", label: "Birds called drone" },
];

const PIPELINE = ["Video / webcam", "YOLO26", "ByteTrack", "Zone + alert rules", "FastAPI", "React dashboard"];

const FEATURES = [
    "Two-class detector (drone vs bird) so birds never trigger drone alerts",
    "Stable track IDs, flight paths, speed and compass heading per object",
    "Draw a restricted zone; 5-frame rule, re-arm and cooldown prevent alert spam",
    "Predicts zone entry up to 4 s ahead and shows time-to-entry warnings",
    "Runs fully offline on a laptop CPU — MJPEG stream, WebSocket state, SQLite alert log",
];

export default function SkyWatchShowcase() {
    const [active, setActive] = useState(0);
    const shot = SHOTS[active];

    return (
        <section className="py-24 md:py-32 bg-navy-secondary">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
                    {/* Screenshots */}
                    <AnimatedSection delay={0.1}>
                        <div className="relative">
                            <div className="relative rounded-sm overflow-hidden border border-navy-border bg-navy-card">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={shot.key}
                                        src={shot.src}
                                        alt={`SkyWatch dashboard — ${shot.caption}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="w-full h-auto block"
                                    />
                                </AnimatePresence>
                                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan pointer-events-none" />
                                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-coral pointer-events-none" />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                                <div className="flex gap-2" role="tablist" aria-label="SkyWatch screenshots">
                                    {SHOTS.map((s, i) => (
                                        <button
                                            key={s.key}
                                            role="tab"
                                            aria-selected={active === i}
                                            onClick={() => setActive(i)}
                                            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border rounded-sm transition-colors ${
                                                active === i
                                                    ? "border-cyan text-cyan bg-cyan/10"
                                                    : "border-navy-border text-text-muted hover:text-text-primary"
                                            }`}
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-text-label text-xs">{shot.caption}</p>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Description */}
                    <AnimatedSection delay={0.2}>
                        <div>
                            <p
                                className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-6"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                · Computer Vision Project
                            </p>
                            <h2
                                className="text-4xl md:text-5xl font-bold leading-tight mb-5"
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                            >
                                SkyWatch: <span className="text-gradient-cyan">Drone Detection &amp; Tracking</span>
                            </h2>
                            <p className="text-text-muted text-base leading-relaxed mb-8">
                                A real-time vision system that watches a video or live camera, detects drones and
                                birds, follows each one across frames, and raises an alert when a drone enters a
                                restricted zone you draw — even predicting entry before it happens.
                            </p>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                {METRICS.map((m) => (
                                    <div key={m.label} className="bg-navy-card border border-navy-border rounded-sm p-3">
                                        <p className="text-cyan text-xl font-bold" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                            {m.value}
                                        </p>
                                        <p className="text-text-label text-[10px] uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                            {m.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Pipeline */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-8">
                                {PIPELINE.map((step, i) => (
                                    <span key={step} className="flex items-center gap-1.5">
                                        <span
                                            className="px-2.5 py-1 text-[10px] border border-navy-border text-text-muted rounded-sm"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {step}
                                        </span>
                                        {i < PIPELINE.length - 1 && <span className="text-coral text-xs">→</span>}
                                    </span>
                                ))}
                            </div>

                            <ul className="space-y-2.5 mb-8">
                                {FEATURES.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan mt-2 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <p className="text-text-label text-xs leading-relaxed mb-8">
                                YOLO26n trained on 13,973 cleaned images (Mendeley Drone vs Bird) on a Colab T4 —
                                including fixing mislabelled classes and misplaced validation boxes in the public dataset.
                            </p>

                            <Button href={REPO_URL} external variant="primary">
                                View on GitHub →
                            </Button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
