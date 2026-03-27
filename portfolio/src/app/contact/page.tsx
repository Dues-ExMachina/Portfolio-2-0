"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import { Mail, Linkedin, Github, CheckCircle, MapPin } from "lucide-react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
        if (!form.message.trim() || form.message.length < 10) errs.message = "Message must be at least 10 chars";
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setStatus("loading");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus("success");
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const inputClass = (field: string) =>
        `w-full bg-navy border rounded-sm px-4 py-3 text-text-primary placeholder-text-label text-sm outline-none transition-all duration-300 focus:border-coral focus:shadow-[0_0_20px_rgba(255,61,90,0.1)] ${errors[field] ? "border-coral/70" : "border-navy-border"
        }`;

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-navy">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <AnimatedSection>
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-4"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            · Get in Touch
                        </p>
                        <h1
                            className="text-5xl md:text-7xl font-bold leading-[0.95] mb-6"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Let&apos;s Build
                            <br />
                            <span className="text-gradient-coral">Something.</span>
                        </h1>
                        <p className="text-text-muted text-base max-w-xl">
                            Open to collaborations, consulting engagements, and full-time opportunities in AI/ML.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Form section */}
            <section className="py-16 bg-navy-secondary">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12">
                        {/* Form */}
                        <AnimatedSection delay={0.1}>
                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-20 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                        >
                                            <CheckCircle className="text-coral w-16 h-16 mb-6 mx-auto" />
                                        </motion.div>
                                        <h2
                                            className="text-text-primary font-bold text-3xl mb-3"
                                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                                        >
                                            Message Sent!
                                        </h2>
                                        <p className="text-text-muted mb-8">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="text-coral text-[11px] uppercase tracking-widest hover:text-white transition-colors border border-coral px-6 py-3 group relative overflow-hidden"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            <span className="absolute inset-0 bg-coral translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
                                            <span className="relative z-10">Send Another →</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-text-label text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                    Your Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Anubhab Das"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className={inputClass("name")}
                                                />
                                                {errors.name && <p className="text-coral text-xs mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-text-label text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    className={inputClass("email")}
                                                />
                                                {errors.email && <p className="text-coral text-xs mt-1">{errors.email}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-text-label text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Let's collaborate on..."
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                className={inputClass("subject")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-text-label text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                Message
                                            </label>
                                            <textarea
                                                rows={6}
                                                placeholder="Tell me about your project or idea..."
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                className={`${inputClass("message")} resize-none`}
                                            />
                                            {errors.message && <p className="text-coral text-xs mt-1">{errors.message}</p>}
                                        </div>
                                        {status === "error" && (
                                            <p className="text-coral text-sm bg-coral/10 border border-coral/20 rounded-sm px-4 py-3">
                                                Something went wrong. Please try again or email directly.
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className="w-full relative inline-flex items-center justify-center gap-2 py-4 bg-coral text-white text-[11px] uppercase tracking-[0.25em] font-bold overflow-hidden hover:bg-coral/90 transition-all duration-300 disabled:opacity-60"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {status === "loading" ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Message →"
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </AnimatedSection>

                        {/* Contact info card */}
                        <AnimatedSection delay={0.2}>
                            <div className="bg-navy-card border border-coral/20 rounded-sm p-8 h-fit">
                                <p
                                    className="text-text-label text-[11px] uppercase tracking-[0.25em] mb-6"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Reach Out
                                </p>

                                <div className="space-y-5">
                                    {/* Availability */}
                                    <div className="flex items-center gap-3 p-3 bg-navy rounded-sm border border-navy-border">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-text-primary text-sm">Available for Projects</span>
                                    </div>

                                    {/* Spacer */}
                                    <div className="border-t border-navy-border my-4" />

                                    {[
                                        { icon: Mail, label: "Email", value: "anubhabd45@gmail.com", href: "mailto:anubhabd45@gmail.com" },
                                        { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/anubhab-das45", href: "https://linkedin.com/in/anubhab-das45/" },
                                        { icon: Github, label: "GitHub", value: "github.com/Dues-ExMachina", href: "https://github.com/Dues-ExMachina" },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <p
                                                className="text-text-label text-[10px] uppercase tracking-widest mb-1"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {item.label}
                                            </p>
                                            <a
                                                href={item.href}
                                                className="flex items-center gap-2 text-text-muted hover:text-coral transition-colors text-sm"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <item.icon size={14} className="text-coral shrink-0" />
                                                {item.value}
                                            </a>
                                        </div>
                                    ))}

                                    <div className="border-t border-navy-border my-4" />

                                    <div>
                                        <p
                                            className="text-text-label text-[10px] uppercase tracking-widest mb-1"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            Based In
                                        </p>
                                        <div className="flex items-center gap-2 text-text-muted text-sm">
                                            <MapPin size={14} className="text-coral shrink-0" />
                                            Kolkata, India
                                        </div>
                                    </div>

                                    {/* Response time */}
                                    <div className="mt-6 p-4 bg-coral/5 border border-coral/20 rounded-sm">
                                        <p className="text-text-muted text-xs leading-relaxed" style={{ fontFamily: "var(--font-space-mono)" }}>
                                            Typical response time: <span className="text-coral">24 hours</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
