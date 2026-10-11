"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Linkedin, FileText } from "lucide-react";

const RESUME_URL = "https://drive.google.com/file/d/12B6imAoSFKITgq-HhQrbdywUkctsoaBR/view?usp=sharing";

const socialLinks = [
    { href: "https://github.com/Dues-ExMachina", label: "GitHub", icon: Github },
    { href: "https://www.linkedin.com/in/anubhab-das45/", label: "LinkedIn", icon: Linkedin },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const leftLinks = [
        { href: "/about", label: "About" },
        { href: "/projects", label: "Work" },
    ];
    const rightLinks = [
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-navy/80 border-b border-navy-border" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
                {/* Left links */}
                <nav className="hidden md:flex flex-1 items-center gap-8">
                    {leftLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActive(link.href) ? "text-coral!" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Center — Logo */}
                <Link href="/" className="flex items-center justify-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-10 h-10 flex items-center justify-center"
                    >
                        <div className="absolute inset-0 rounded-sm border border-coral/40 rotate-45" />
                        <span
                            className="relative z-10 text-coral font-bold text-sm"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            AD
                        </span>
                    </motion.div>
                </Link>

                {/* Right links */}
                <nav className="hidden md:flex flex-1 items-center justify-end gap-6 lg:gap-8">
                    {rightLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActive(link.href) ? "text-coral!" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <span className="w-px h-4 bg-navy-border" />
                    <div className="flex items-center gap-3">
                        {socialLinks.map(({ href, label, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                                className="text-text-muted hover:text-coral transition-colors duration-300"
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                    <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center gap-1.5 px-4 py-2 border border-coral text-coral text-[10px] uppercase tracking-[0.2em] font-bold group overflow-hidden transition-colors duration-300 hover:text-white"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        <span className="absolute inset-0 bg-coral -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        <FileText size={12} className="relative z-10" />
                        <span className="relative z-10">Resume</span>
                    </a>
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span
                        className={`block w-5 h-px bg-text-primary transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                    />
                    <span
                        className={`block w-5 h-px bg-text-primary transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
                    />
                    <span
                        className={`block w-5 h-px bg-text-primary transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                    />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-navy-secondary border-t border-navy-border px-6 py-6 flex flex-col gap-4"
                >
                    {[...leftLinks, ...rightLinks].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`nav-link text-sm ${isActive(link.href) ? "text-coral!" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-5 pt-4 border-t border-navy-border">
                        {socialLinks.map(({ href, label, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="text-text-muted hover:text-coral transition-colors duration-300"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                        <a
                            href={RESUME_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 border border-coral text-coral text-[10px] uppercase tracking-[0.2em] font-bold"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            <FileText size={12} />
                            Resume
                        </a>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
