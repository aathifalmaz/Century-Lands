"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Play } from "lucide-react"
import Link from "next/link"

export function CallToAction() {
    return (
        <section className="py-12 px-6 lg:px-20 bg-transparent overflow-hidden">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT — Text Section */}
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-[1.1]">
                            Find Your Dream <br />
                            <span className="text-primary italic font-serif">Property</span> Today
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                            Browse premium listings, book appointments, and get
                            personalized support from Century Lands & Homes. Experience the best in Sri Lankan Real Estate.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link href="/properties">
                                <Button className="bg-secondary hover:bg-accent hover:text-accent-foreground font-semibold px-6 py-6 text-base shadow-md hover:shadow-lg transition-all">
                                    <p className="text-lg">View Properties</p>
                                </Button>
                            </Link>

                            <Link href="/contact">
                                <Button
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary hover:text-white px-6 py-6 text-base transition-all"
                                >
                                    <p className="text-lg">Contact Us</p>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT — Image Section */}
                    <div className="relative">
                        {/* Decorative background shape (Optional, fits the "leaf" aesthetic) */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

                        <div className="relative h-[400px] md:h-[600px] w-full rounded-tl-[120px] rounded-br-[40px] overflow-hidden shadow-2xl">
                            <Image
                                src="/mock/choose.jpg"
                                alt="Luxury Property"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
