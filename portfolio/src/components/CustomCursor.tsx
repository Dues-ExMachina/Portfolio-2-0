"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };
        const checkPointer = (e: MouseEvent) => {
            const target = e.target as Element;
            setIsPointer(
                target.matches("a, button, [role='button'], input, textarea, select, label")
            );
        };
        const hide = () => setIsVisible(false);

        window.addEventListener("mousemove", move);
        window.addEventListener("mousemove", checkPointer);
        window.addEventListener("mouseleave", hide);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousemove", checkPointer);
            window.removeEventListener("mouseleave", hide);
        };
    }, []);

    return (
        <>
            {/* Main dot */}
            <motion.div
                className="fixed top-0 left-0 z-[99999] pointer-events-none mix-blend-difference"
                animate={{
                    x: position.x - (isPointer ? 16 : 4),
                    y: position.y - (isPointer ? 16 : 4),
                    opacity: isVisible ? 1 : 0,
                    scale: isPointer ? 2.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 800, damping: 40 }}
            >
                <div
                    className="rounded-full bg-coral"
                    style={{ width: isPointer ? "12px" : "8px", height: isPointer ? "12px" : "8px" }}
                />
            </motion.div>
            {/* Ring follower */}
            <motion.div
                className="fixed top-0 left-0 z-[99998] pointer-events-none"
                animate={{
                    x: position.x - 20,
                    y: position.y - 20,
                    opacity: isVisible ? 0.4 : 0,
                    scale: isPointer ? 1.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
                <div className="w-10 h-10 rounded-full border border-coral" />
            </motion.div>
        </>
    );
}
