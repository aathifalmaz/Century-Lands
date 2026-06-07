"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface Props {
    children: ReactNode
    delay?: number
}

export function ScrollReveal({ children, delay = 0 }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{
                duration: 0.8,
                delay,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    )
}
