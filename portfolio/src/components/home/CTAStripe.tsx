"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";

export default function CTAStripe() {
    return (
        <section className="py-24 md:py-32 bg-navy relative overflow-hidden">
            {/* Background decoration */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,61,90,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,90,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full opacity-10"
                style={{ background: "radial-gradient(ellipse, #FF3D5A, transparent)", filter: "blur(60px)" }}
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center relative z-10">
                <AnimatedSection>
                    <p
                        className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-4"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        · Collaboration
                    </p>
                    <h2
                        className="text-4xl md:text-6xl font-bold text-text-primary mb-6"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                        Want to build
                        <br />
                        <span className="text-gradient-coral">AI together?</span>
                    </h2>
                    <p className="text-text-muted text-base max-w-xl mx-auto mb-10">
                        I&apos;m open to collaborations, consulting engagements, and full-time opportunities.
                        Let&apos;s create something extraordinary.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button href="/contact" variant="primary" size="lg">
                            Get In Touch →
                        </Button>
                        <Button href="/projects" variant="ghost" size="lg">
                            View My Work
                        </Button>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
