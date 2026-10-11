import AnimatedSection from "@/components/AnimatedSection";
import { experiences, currentRoleHighlights } from "@/data/experience";

interface CurrentRoleProps {
    className?: string;
}

export default function CurrentRole({ className = "bg-navy" }: CurrentRoleProps) {
    const exp = experiences[0];

    return (
        <section className={`py-20 md:py-24 ${className}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <AnimatedSection className="mb-10">
                    <p
                        className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-3 flex items-center gap-2"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        <span className="relative flex w-2 h-2">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-coral opacity-75 animate-ping" />
                            <span className="relative inline-flex w-2 h-2 rounded-full bg-coral" />
                        </span>
                        · Currently Working At
                    </p>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-text-primary"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                        Industry <span className="text-gradient-coral">Experience</span>
                    </h2>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-navy-card border border-coral/40 shadow-[0_0_40px_rgba(255,61,90,0.12)] rounded-sm p-6 md:p-8">
                        {/* Screenshot */}
                        {exp.image && (
                            <a
                                href={exp.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block relative overflow-hidden rounded-sm border border-navy-border"
                            >
                                <img
                                    src={exp.image}
                                    alt={`${exp.company} product screenshot`}
                                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                            </a>
                        )}

                        {/* Details */}
                        <div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                                <span
                                    className="text-text-label text-[11px] uppercase tracking-widest"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {exp.years}
                                </span>
                                <span className="text-text-label text-[11px]" style={{ fontFamily: "var(--font-space-mono)" }}>
                                    {exp.location}
                                </span>
                            </div>
                            <h3
                                className="text-text-primary font-bold text-2xl md:text-3xl"
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                            >
                                {exp.role}
                            </h3>
                            <a
                                href={exp.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-coral text-sm mt-1 mb-4 hover:underline"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                {exp.company} ↗
                            </a>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">{exp.desc}</p>

                            <ul className="space-y-3 mb-6">
                                {currentRoleHighlights.map((h) => (
                                    <li key={h.label} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                                        <span
                                            className="shrink-0 min-w-[64px] text-coral text-[11px] uppercase tracking-wider pt-0.5"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {h.stat}
                                        </span>
                                        {h.label}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {exp.stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2.5 py-1 border border-navy-border text-text-label text-[10px] uppercase tracking-widest rounded-sm"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <a
                                href="/about"
                                className="relative inline-flex items-center gap-2 px-6 py-3 border border-coral text-coral text-[10px] uppercase tracking-[0.2em] font-bold group overflow-hidden transition-colors duration-300 hover:text-white"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                <span className="absolute inset-0 bg-coral -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                <span className="relative z-10">Full Experience Details →</span>
                            </a>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
