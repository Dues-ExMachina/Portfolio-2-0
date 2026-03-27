"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
    variant?: "primary" | "ghost" | "outline-cyan";
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
    external?: boolean;
}

const sizeClasses = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-[11px]",
    lg: "px-8 py-4 text-[12px]",
};

export default function Button({
    variant = "primary",
    children,
    href,
    onClick,
    type = "button",
    disabled = false,
    className = "",
    size = "md",
    external = false,
}: ButtonProps) {
    const baseClasses = `
    relative inline-flex items-center gap-2 overflow-hidden
    tracking-[0.25em] uppercase font-bold transition-all duration-300
    disabled:opacity-50 disabled:pointer-events-none
    ${sizeClasses[size]}
  `;

    const variantClasses = {
        primary: "border border-coral text-coral hover:text-white group",
        ghost: "border border-navy-border text-text-muted hover:border-cyan hover:text-cyan",
        "outline-cyan": "border border-cyan text-cyan hover:bg-cyan hover:text-navy",
    };

    const content = (
        <>
            {variant === "primary" && (
                <span className="absolute inset-0 bg-coral translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
            )}
            <span className="relative z-10 flex items-center gap-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                {children}
            </span>
        </>
    );

    if (href) {
        return (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={`${baseClasses} ${variantClasses[variant]} ${className}`}
                >
                    {content}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {content}
        </motion.button>
    );
}
