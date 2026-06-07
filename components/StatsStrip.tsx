"use client"

import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import { Home, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StatsStripProps {
    stats?: {
        propertiesCount: number
        citiesCount: number
        clientsCount: number
    }
}

export function StatsStrip({ stats }: StatsStripProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    })

    const data = stats || {
        propertiesCount: 1200,
        citiesCount: 12,
        clientsCount: 850
    }

    return (
        <section className="w-full bg-transparent py-16 border-t">
            <div
                ref={ref}
                className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center"
            >

                {/* RIGHT — Content */}
                <div className="text-center lg:text-left space-y-6">

                    <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                        Build Your Future With <br />
                        Century Lands & Homes
                    </h2>

                    <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto lg:mx-0">
                        Discover verified lands, luxury homes, and premium investments
                        across Sri Lanka. We make property buying simple, transparent,
                        and trusted.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">

                        {/* Browse Properties */}
                        <Link href="/properties">
                            <Button className="bg-secondary hover:bg-accent hover:text-accent-foreground font-semibold px-6 py-6 text-base shadow-md hover:shadow-lg transition-all">
                                <span className="text-lg">Browse Properties</span>
                            </Button>
                        </Link>

                        {/* Contact Us */}
                        <Link href="/contact">
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-white px-6 py-6 text-base transition-all"
                            >
                                <span className="text-lg">Contact Us</span>
                            </Button>
                        </Link>

                    </div>
                </div>

                {/* LEFT — Metrics */}
                <div className="grid sm:grid-cols-3 gap-10 relative">

                    {/* Divider Lines (Desktop Only) */}
                    <div className="hidden sm:block absolute left-1/3 top-0 bottom-0 w-px bg-border" />
                    <div className="hidden sm:block absolute left-2/3 top-0 bottom-0 w-px bg-border" />

                    {/* Metric 1 */}
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-xl bg-secondary/10">
                            <Home className="h-12 w-12 text-secondary" />
                        </div>

                        <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            {inView && (
                                <CountUp end={data.propertiesCount} duration={2.5} separator="," />
                            )}
                            +
                        </h3>

                        <p className="text-muted-foreground text-lg">
                            Properties Listed
                        </p>
                    </div>

                    {/* Metric 2 */}
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-xl bg-secondary/10">
                            <Users className="h-12 w-12 text-secondary" />
                        </div>

                        <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            {inView && (
                                <CountUp end={data.clientsCount} duration={2.5} separator="," />
                            )}
                            +
                        </h3>

                        <p className="text-muted-foreground text-lg">
                            Happy Clients
                        </p>
                    </div>

                    {/* Metric 3 */}
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-xl bg-secondary/10">
                            <MapPin className="h-12 w-12 text-secondary" />
                        </div>

                        <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            {inView && <CountUp end={data.citiesCount} duration={2} />}
                            +
                        </h3>

                        <p className="text-muted-foreground text-lg">
                            Cities Covered
                        </p>
                    </div>

                </div>

            </div>
        </section>
    )
}
