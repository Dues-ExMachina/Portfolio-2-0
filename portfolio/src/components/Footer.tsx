import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-coral py-12 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left — Logo + socials */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 border border-white/40 rotate-45">
                            <span
                                className="text-white font-bold text-sm -rotate-45"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                AD
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {[
                                {
                                    icon: <Linkedin size={14} />,
                                    href: "https://www.linkedin.com/in/anubhab-das45/",
                                    label: "LinkedIn",
                                },
                                {
                                    icon: <Github size={14} />,
                                    href: "https://github.com/Dues-ExMachina",
                                    label: "GitHub",
                                },
                                {
                                    icon: <Twitter size={14} />,
                                    href: "https://twitter.com",
                                    label: "Twitter",
                                },
                            ].map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center — Name */}
                    <div className="text-center">
                        <p
                            className="text-white font-bold text-lg"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                            ANUBHAB DAS
                        </p>
                        <p
                            className="text-white/70 text-xs uppercase tracking-widest mt-1"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            Generative AI Engineer
                        </p>
                    </div>

                    {/* Right — Links */}
                    <nav className="flex flex-wrap justify-center md:justify-end gap-6">
                        {[
                            { href: "/about", label: "About" },
                            { href: "/projects", label: "Work" },
                            { href: "/blog", label: "Blog" },
                            { href: "/contact", label: "Contact" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 text-center">
                    <p
                        className="text-white/60 text-xs"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        © {new Date().getFullYear()} ANUBHAB DAS. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    );
}
