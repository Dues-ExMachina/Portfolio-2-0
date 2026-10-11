import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import { experiences } from "@/data/experience";
import {
    Brain,
    Database,
    Bot,
    Workflow,
    ShieldCheck,
    Server,
} from "lucide-react";

const skills = [
    { icon: Brain, title: "LLM Applications", desc: "Production LLM chatbots and assistants with prompt engineering, tool-calling and structured outputs, integrated into enterprise apps through APIs." },
    { icon: Database, title: "RAG Systems", desc: "Retrieval-augmented generation with Pinecone — query expansion, cross-encoder reranking and data pipelines that feed grounded context." },
    { icon: Bot, title: "Agentic AI", desc: "Multi-step agents with LangGraph and MCP — autonomous browsing agents (Browser Use, Playwright) and dynamic tool selection." },
    { icon: Workflow, title: "Workflow Orchestration", desc: "Durable, multi-stage LLM workflows with Temporal — including iterative self-critique loops for investigation analysis." },
    { icon: ShieldCheck, title: "LLM Evaluation & Compliance", desc: "Rubric-based response evaluation and traceability for regulated (pharma / GxP) domains where accuracy is non-negotiable." },
    { icon: Server, title: "Backend & Full-Stack", desc: "FastAPI, PostgreSQL (recursive CTEs), SQLAlchemy, React with Redux / RTK Query and React Flow, plus PDF reporting with Jinja2 / WeasyPrint." },
];

const education = [
    {
        subject: "Computer Science and Engineering",
        company: "Elitte College of Engineering",
        years: "2023 — 2026",
        cgpa: "8",
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
    "Web Development — DTH/Internship/2024/86"
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
                                I&apos;m a Generative AI Engineer who builds and ships LLM-powered systems in production.
                                Currently a Software Developer at{" "}
                                <a href="https://aivoa.ai/" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">
                                    AIVOA.ai
                                </a>
                                , building an agentic eQMS platform for pharmaceutical / GxP clients — where accuracy,
                                traceability and regulatory compliance aren&apos;t optional. I work across agentic
                                pipelines, RAG, workflow orchestration and the full-stack product around them.
                            </p>
                            <ul className="space-y-3">
                                {["Agentic AI with LangGraph & MCP", "RAG Systems & Vector Search (Pinecone)", "LLM Evaluation & Self-Critique Loops", "Workflow Orchestration with Temporal", "FastAPI, PostgreSQL & React"].map((item) => (
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
                    <div className="relative pl-6 md:pl-10">
                        {/* Vertical line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-navy-border" />
                        <div className="space-y-12">
                            {experiences.map((exp, idx) => (
                                <AnimatedSection key={`${exp.company}-${exp.role}`} delay={idx * 0.15}>
                                    <div className="relative">
                                        {/* Coral dot */}
                                        <div className="absolute -left-6 md:-left-10 top-7 w-3 h-3 rounded-full bg-coral border-2 border-navy -translate-x-1/2 z-10" />

                                        <div className="bg-navy-card border border-navy-border rounded-sm p-6 md:p-8 hover:border-coral/40 transition-colors duration-500">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                                                <div>
                                                    <h3
                                                        className="text-text-primary font-bold text-xl md:text-2xl"
                                                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                                                    >
                                                        {exp.role}
                                                    </h3>
                                                    <p className="text-coral text-sm mt-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                        {exp.url ? (
                                                            <a href={exp.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                                {exp.company} ↗
                                                            </a>
                                                        ) : (
                                                            exp.company
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="md:text-right">
                                                    <span
                                                        className="text-text-label text-[11px] uppercase tracking-widest"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        {exp.years}
                                                    </span>
                                                    <p className="text-text-label text-[11px] mt-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                                                        {exp.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-text-muted text-sm leading-relaxed mb-5">{exp.desc}</p>

                                            {exp.image && (
                                                <a
                                                    href={exp.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group block relative overflow-hidden rounded-sm border border-navy-border mb-6"
                                                >
                                                    <img
                                                        src={exp.image}
                                                        alt={`${exp.company} product screenshot`}
                                                        className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                                                    />
                                                </a>
                                            )}

                                            <ul className="space-y-3 mb-6">
                                                {exp.highlights.map((point) => (
                                                    <li key={point} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2 shrink-0" />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="flex flex-wrap gap-2">
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
                                        </div>
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
                                    Elitte College of Engineering
                                </p>
                                <p className="text-text-label text-xs" style={{ fontFamily: "var(--font-space-mono)" }}>
                                    2023 — 2026 · CGPA {education[0].cgpa} / 10
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
