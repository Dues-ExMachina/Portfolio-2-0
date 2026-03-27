"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    stagger?: boolean;
}

export default function AnimatedSection({
    children,
    className = "",
    delay = 0,
    stagger = false,
}: AnimatedSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay,
            }}
            className={className}
        >
            {stagger ? (
                <motion.div
                    variants={{
                        visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {children}
                </motion.div>
            ) : (
                children
            )}
        </motion.div>
    );
}

export const fadeUpItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
