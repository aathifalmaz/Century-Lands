"use client"

import { useInView } from "react-intersection-observer"
import CountUp from "react-countup"

const StatItem = ({ end, label, suffix = "+" }: { end: number, label: string, suffix?: string }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })

    return (
        <div ref={ref} className="text-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {inView ? <CountUp end={end} duration={2.5} separator="," /> : 0}{suffix}
            </div>
            <p className="text-muted-foreground font-medium uppercase tracking-wide text-sm">{label}</p>
        </div>
    )
}

interface StatsSectionProps {
    stats?: {
        soldPropertiesCount: number
        clientsCount: number
        citiesCount: number
    }
}

export function StatsSection({ stats }: StatsSectionProps) {
    const data = stats || {
        soldPropertiesCount: 500,
        clientsCount: 1200,
        citiesCount: 25
    }

    return (
        <section className="py-12 px-4 relative">
            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatItem end={data.soldPropertiesCount} label="Properties Sold" />
                <StatItem end={data.clientsCount} label="Happy Clients" />
                <StatItem end={10} label="Years Experience" />
                <StatItem end={data.citiesCount} label="Locations Covered" />
            </div>
        </section>
    )
}
