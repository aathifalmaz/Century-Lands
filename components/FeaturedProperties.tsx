"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules"
import "swiper/css/grid"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { BedDouble, Bath, Maximize, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

import { PropertyListingItem } from "./PropertyListings"

interface FeaturedPropertiesProps {
    properties: PropertyListingItem[]
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <section className="py-16 px-6 lg:px-20 bg-transparent min-h-[800px]">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-pulse">
                    <div className="h-12 w-64 bg-slate-200 rounded-lg mx-auto mb-4" />
                    <div className="h-4 w-96 bg-slate-100 rounded-md mx-auto" />
                </div>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-96 rounded-2xl bg-slate-50 border border-border/50 animate-pulse" />
                    ))}
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-6 lg:px-20 bg-transparent">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">

                <h2 className="
    text-4xl md:text-5xl
    font-bold
    leading-tight md:leading-snug
    bg-gradient-to-r from-third to-secondary
    bg-clip-text text-transparent
  ">
                    Featured Properties
                </h2>

                {/* Divider */}
                <div className="flex justify-center mt-3">
                    <div className="h-[3px] w-24 bg-gradient-to-r from-secondary to-accent rounded-full" />
                </div>

                <p className="text-muted-foreground mt-6 leading-relaxed text-lg">
                    Explore premium listings curated for comfort, style, and prime locations.
                </p>

            </div>


            {/* Swiper Carousel Container */}
            <div className="container mx-auto relative">

                {/* Custom Navigation Buttons */}
                <button
                    className="featured-prev absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-12 z-20 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-primary transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex border border-border/50"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    className="featured-next absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 z-20 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-primary transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex border border-border/50"
                    aria-label="Next Slide"
                >
                    <ChevronRight size={24} />
                </button>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay, Grid]}
                    spaceBetween={24}
                    loop={false}
                    speed={1500}

                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}

                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}

                    navigation={{
                        prevEl: ".featured-prev",
                        nextEl: ".featured-next",
                    }}

                    grid={{
                        rows: 2,
                        fill: "row", // fills row by row instead of column
                    }}

                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            grid: { rows: 2 },
                            spaceBetween: 16,
                        },
                        640: {
                            slidesPerView: 2,
                            grid: { rows: 2 },
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            grid: { rows: 2 },
                            spaceBetween: 24,
                        },
                        1400: {
                            slidesPerView: 4,
                            grid: { rows: 2 },
                            spaceBetween: 30,
                        },
                    }}

                    className="!px-5 !-mx-5 relative !pb-20"
                    style={{
                        "--swiper-pagination-color": "hsl(var(--accent))",
                        "--swiper-pagination-bullet-inactive-color": "hsl(var(--muted-foreground))",
                        "--swiper-pagination-bullet-inactive-opacity": "0.4",
                        "--swiper-pagination-bullet-size": "10px",
                        "--swiper-pagination-bullet-horizontal-gap": "6px",
                        "--swiper-pagination-bottom": "0px",
                    } as React.CSSProperties}
                >

                    {properties.map((property) => (
                        <SwiperSlide key={property.id} className="flex h-auto">

                            <div className="group h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500">

                                <div className="relative h-60 overflow-hidden">
                                    <Image
                                        src={property.image}
                                        alt={property.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition duration-700"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 shadow-sm">
                                        <span className="text-sm font-bold text-primary">{property.price}</span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-1">
                                            {property.title}
                                        </h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2 py-2 border-t border-b border-border/40">
                                        <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium">
                                            <BedDouble size={14} className="text-secondary" />
                                            <span>{property.beds} Beds</span>
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium">
                                            <Bath size={14} className="text-secondary" />
                                            <span>{property.baths} Baths</span>
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium">
                                            <Maximize size={14} className="text-secondary" />
                                            <span>{property.size}</span>
                                        </Badge>
                                    </div>

                                    <Button className="w-full mt-auto bg-primary hover:bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 group-hover:translate-y-0">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* See All */}
            <div className="flex justify-center mt-12">
                <Link href="/properties">
                    <Button
                        variant="outline"
                        className="px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md font-semibold"
                    >
                        <p className="text-lg">See All Properties</p>
                    </Button>
                </Link>
            </div>
        </section>
    )
}
