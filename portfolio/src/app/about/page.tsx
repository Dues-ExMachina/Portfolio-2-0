import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import {
    Brain,
    Database,
    Palette,
    MessageSquare,
    Container,
    Sparkles,
} from "lucide-react";

const skills = [
    { icon: Brain, title: "LLM Engineering", desc: "Fine-tuning, RLHF, instruction tuning, and productionizing large language models at scale." },
    { icon: Database, title: "RAG Systems", desc: "End-to-end retrieval-augmented generation pipelines with vector databases and semantic search." },
    { icon: Palette, title: "Agentic AI", desc: "Building agentic syatems with Langgraph, automating tasks" },
    { icon: MessageSquare, title: "Prompt Architecture", desc: "Systematic prompt engineering, chain-of-thought, and few-shot learning strategies." },
    { icon: Container, title: "MLOps & Deployment", desc: "Model serving, monitoring, and CI/CD pipelines for ML systems using Docker and Kubernetes." },
    { icon: Sparkles, title: "Creative AI", desc: "Building AI-powered creative tools that merge art and technology in unexpected ways." },
];

// remove this when adding expiriance
interface Experience {
    role: string;
    company: string;
    years: string;
    desc: string;
    side: "left" | "right";
}
// remove this when adding expiriance
const experiences: Experience[] = [];

    // const experiences = [
    // {
    //     role: "Senior AI Engineer",
    //     company: "TechVentures AI",
    //     years: "2024 — Present",
    //     desc: "Leading the development of production-grade RAG systems and LLM orchestration pipelines serving millions of users.",
    //     side: "right",
    // },
    // {
    //     role: "ML Engineer",
    //     company: "Startup Innovations",
    //     years: "2022 — 2024",
    //     desc: "Built end-to-end ML pipelines, deployed diffusion models, and developed agentic systems for enterprise clients.",
    //     side: "left",
    // },
    // {
    //     role: "AI Research Intern",
    //     company: "Research Lab",
    //     years: "2021 — 2022",
    //     desc: "Conducted research on transformer architectures and contributed to published papers on efficient LLM inference.",
    //     side: "right",
    // },
// ];

const education = [
    {
        subject: "Computer Scirnce and Engineering",
        company: "Elitte College of Engineering",
        years: "2023 — 2026",
        sgpa: "7",
        side: "right",
    }
];

// const certs = [
//     "Google Cloud Professional ML Engineer",
//     "DeepLearning.AI – LLMOps Specialization",
//     "Hugging Face – Open-Source AI",
//     "AWS Solutions Architect",
// ];

const certs = [
    "Web Developmen - DTH/Internship/2024/86"
]

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-20 bg-navy">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Photo card */}
                        <AnimatedSection delay={0.1}>
                            <div className="relative max-w-sm mx-auto lg:mx-0">
                                <div className="aspect-3/4 relative overflow-hidden rounded-sm bg-navy-secondary border border-navy-border">
                                    {/* Image placeholder with generative art look */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: "linear-gradient(135deg, #0C1535 0%, #080F28 50%, #0C1535 100%)",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-20"
                                            style={{
                                                backgroundImage: "linear-gradient(rgba(255,61,90,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.3) 1px, transparent 1px)",
                                                backgroundSize: "40px 40px",
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div
                                                    className="w-32 h-32 rounded-full mx-auto mb-4 animate-morph"
                                                    style={{
                                                        background: "conic-gradient(from 0deg, #FF3D5A, #8B5CF6, #00C8FF, #FF3D5A)",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    <div
                                                        className="w-full h-full rounded-full flex items-center justify-center"
                                                        style={{ background: "#080F28" }}
                                                    >
                                                        <span
                                                            className="text-coral font-bold text-3xl"
                                                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                                                        >
                                                            AD
                                                        </span>
                                                    </div>
                                                </div>
                                                <p
                                                    className="text-text-muted text-xs uppercase tracking-widest"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    Generative AI Engineer
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Coral border decoration */}
                                <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 border-coral" />
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-coral" />
                            </div>
                        </AnimatedSection>

                        {/* Bio */}
                        <AnimatedSection delay={0.2}>
                            <p
                                className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-4"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                · About Me
                            </p>
                            <h1
                                className="text-5xl md:text-6xl font-bold leading-tight mb-6"
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                            >
                                Anubhab
                                <br />
                                <span className="text-gradient-coral">Das</span>
                            </h1>
                            <p className="text-text-muted text-base leading-relaxed mb-8">
                                I&apos;m a Generative AI Engineer obsessed with building intelligent systems that push
                                the boundary between research and production. From fine-tuning LLMs to architecting
                                complex RAG pipelines and exploring diffusion models — I turn cutting-edge AI into
                                products that actually ship.
                            </p>
                            <ul className="space-y-3">
                                {["LLM Engineering & Fine-tuning", "RAG Systems & Vector Search", "Diffusion Models & Image Gen", "AI Agents & Orchestration", "MLOps & Model Deployment"].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-text-muted text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Skills */}
            <section className="py-24 bg-navy-secondary">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <AnimatedSection className="mb-14">
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-3"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            · Expertise
                        </p>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-text-primary"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Core Skills
                        </h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {skills.map((skill, idx) => (
                            <AnimatedSection key={skill.title} delay={idx * 0.08}>
                                <div className="group bg-navy-card border border-navy-border rounded-sm p-6 hover:border-coral/40 hover:shadow-[0_0_30px_rgba(255,61,90,0.1)] transition-all duration-500 h-full">
                                    <div className="w-full h-0.5 bg-coral mb-6 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                    <div className="w-10 h-10 rounded-sm bg-navy border border-navy-border flex items-center justify-center mb-4 text-coral group-hover:bg-coral/10 transition-colors">
                                        <skill.icon size={20} />
                                    </div>
                                    <h3
                                        className="text-text-primary font-bold text-lg mb-3"
                                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                                    >
                                        {skill.title}
                                    </h3>
                                    <p className="text-text-muted text-sm leading-relaxed">{skill.desc}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            {experiences && experiences.length > 0 && (
            <section className="py-24 bg-navy">
                <div className="max-w-4xl mx-auto px-6 lg:px-10">
                    <AnimatedSection className="mb-14 text-center">
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-3"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            · Experience
                        </p>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-text-primary"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Career Journey
                        </h2>
                    </AnimatedSection>
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-navy-border -translate-x-1/2" />
                        <div className="space-y-12">
                            {experiences.map((exp, idx) => (
                                <AnimatedSection key={exp.role} delay={idx * 0.15}>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 relative ${exp.side === "left" ? "md:text-right" : ""}`}>
                                        {/* Coral dot */}
                                        <div className="absolute left-1/2 top-6 w-3 h-3 rounded-full bg-coral border-2 border-navy -translate-x-1/2 z-10 hidden md:block" />

                                        {exp.side === "right" ? (
                                            <>
                                                <div className="md:text-right">
                                                    <span
                                                        className="text-text-label text-[11px] uppercase tracking-widest"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        {exp.years}
                                                    </span>
                                                    <p className="text-coral text-sm mt-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                        {exp.company}
                                                    </p>
                                                </div>
                                                <div className="bg-navy-card border border-navy-border rounded-sm p-5">
                                                    <h3
                                                        className="text-text-primary font-bold text-xl mb-2"
                                                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                                                    >
                                                        {exp.role}
                                                    </h3>
                                                    <p className="text-text-muted text-sm leading-relaxed">{exp.desc}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-navy-card border border-navy-border rounded-sm p-5">
                                                    <h3
                                                        className="text-text-primary font-bold text-xl mb-2"
                                                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                                                    >
                                                        {exp.role}
                                                    </h3>
                                                    <p className="text-text-muted text-sm leading-relaxed">{exp.desc}</p>
                                                </div>
                                                <div>
                                                    <span
                                                        className="text-text-label text-[11px] uppercase tracking-widest"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        {exp.years}
                                                    </span>
                                                    <p className="text-coral text-sm mt-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                        {exp.company}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            )}
            {/* Education + Certs */}
            <section className="py-24 bg-navy-secondary">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <AnimatedSection className="mb-12">
                        <p
                            className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-3"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            · Background
                        </p>
                        <h2
                            className="text-4xl font-bold text-text-primary"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            Education & Certifications
                        </h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatedSection delay={0.1}>
                            <div className="bg-navy-card border-t-2 border-t-coral border border-navy-border rounded-sm p-6">
                                <p
                                    className="text-text-label text-[10px] uppercase tracking-widest mb-4"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Education
                                </p>
                                <h3
                                    className="text-text-primary font-bold text-2xl mb-2"
                                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                                >
                                    B.Tech in Computer Science
                                </h3>
                                <p className="text-coral text-sm mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                    Elitte College of engineering
                                </p>
                                <p className="text-text-label text-xs" style={{ fontFamily: "var(--font-space-mono)" }}>
                                    2023 — 2026 
                                </p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay={0.2}>
                            <div className="bg-navy-card border-t-2 border-t-cyan border border-navy-border rounded-sm p-6">
                                <p
                                    className="text-text-label text-[10px] uppercase tracking-widest mb-4"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Certifications
                                </p>
                                <ul className="space-y-3">
                                    {certs.map((cert) => (
                                        <li key={cert} className="flex items-start gap-3 text-sm text-text-muted">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
