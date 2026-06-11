"use client"

import { motion } from "framer-motion"

export function BackgroundDecor() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none bg-gray-50/50">

            {/* 1. Navy Blue - Top Left (Deep, Professional Base) */}
            <motion.div
                animate={{
                    opacity: [0.15, 0.25, 0.15],
                    scale: [1, 1.1, 1],
                    x: [0, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                // Using a specific Navy Hex #001F3F
                className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-[#001F3F] blur-[180px] mix-blend-multiply"
            />

            {/* 2. Forest Green - Bottom Left/Center (Natural, Grounded) */}
            <motion.div
                animate={{
                    opacity: [0.10, 0.20, 0.10],
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                // Using a Forest Green Hex #228B22
                className="absolute top-[20%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-[#228B22] blur-[180px] mix-blend-multiply"
            />

            <motion.div
                animate={{
                    opacity: [0.10, 0.25, 0.10],
                    scale: [1, 1.1, 1],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                // Using a Forest Green Hex #228B22
                className="absolute -bottom-[10%] -right-[10%] w-[75vw] h-[75vw] rounded-full bg-[#228B22] blur-[180px] mix-blend-multiply"
            />

            {/* 3. Gold - Right/Bottom (Elegant Accent) 
            <motion.div
                animate={{
                    opacity: [0.10, 0.25, 0.10],
                    scale: [1, 1.1, 1],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
                // Using a Gold Hex #C5A028 (Slightly muted for elegance)
                className="absolute -bottom-[10%] -right-[10%] w-[75vw] h-[75vw] rounded-full bg-[#C5A028] blur-[180px] mix-blend-multiply"
            />
            */}

            {/* Optional: A White/Light wash in the center to ensure text readability */}
            <div className="absolute inset-0 bg-white/40 blur-[100px]" />

            {/* Cinematic Grain (Maintains the texture from your original request) */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    )
}