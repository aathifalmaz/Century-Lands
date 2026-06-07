"use client"

import { Globe, CalendarCheck, Star, ShieldCheck } from "lucide-react"

const services = [
    {
        id: 1,
        icon: <ShieldCheck className="h-8 w-8 text-secondary" />,
        title: "Verified Properties",
        description: "All listings are verified to ensure authenticity and peace of mind.",
    },
    {
        id: 2,
        icon: <Star className="h-8 w-8 text-secondary" />,
        title: "Premium Listings",
        description: "Curated premium properties for comfort, style, and prime locations.",
    },
    {
        id: 3,
        icon: <CalendarCheck className="h-8 w-8 text-secondary" />,
        title: "Fast Appointment Booking",
        description: "Schedule property visits quickly and efficiently online.",
    },
    {
        id: 4,
        icon: <Globe className="h-8 w-8 text-secondary" />,
        title: "Nationwide Coverage",
        description: "Explore properties across multiple cities in Sri Lanka with ease.",
    },
]

export function WhyChooseUs() {
    return (
        <section className="py-12 px-6 lg:px-20 bg-transparent overflow-hidden">
            <div className="container mx-auto grid lg:grid-cols-3 gap-16 items-center">

                {/* LEFT — Content (1/3 width, Styled like StatsStrip) */}
                <div className="lg:col-span-1 text-center lg:text-left space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                        Why Choose <br />
                        Century Lands & Homes
                    </h2>

                    <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Discover why our clients trust us for their property needs.
                        We provide quality, reliability, and convenience at every step
                        of your real estate journey in Sri Lanka.
                    </p>

                    {/* Divider */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="h-[4px] w-16 bg-gradient-to-r from-secondary to-accent rounded-full" />
                    </div>
                </div>

                {/* RIGHT — Services Grid (2/3 width) */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl flex flex-col items-start text-left shadow-sm hover:shadow-xl transition-all duration-500 group border border-white/20"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-l">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
