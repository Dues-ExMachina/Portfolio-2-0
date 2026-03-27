"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
                <nav className="hidden md:flex items-center gap-8">
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
                <nav className="hidden md:flex items-center gap-8">
                    {rightLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActive(link.href) ? "text-coral!" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
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
                </motion.div>
            )}
        </header>
    );
}
