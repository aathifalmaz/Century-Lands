"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import "swiper/css"

import { Star } from "lucide-react"
import Image from "next/image"

const reviews = [
    {
        id: 1,
        name: "Chamila Perera",
        location: "Colombo",
        rating: 5,
        comment: "Century Lands & Homes helped me find my dream home quickly. Highly recommended!",
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: 2,
        name: "Kamal Silva",
        location: "Kandy",
        rating: 4,
        comment: "Professional service and verified listings made the process stress-free.",
        photo: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        id: 3,
        name: "Nadeesha Fernando",
        location: "Galle",
        rating: 5,
        comment: "Excellent support and prompt appointments. Found exactly what I wanted!",
        photo: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    {
        id: 4,
        name: "Roshan Jayawardena",
        location: "Negombo",
        rating: 5,
        comment: "Verified and premium properties, exactly as described. Very satisfied!",
        photo: "https://randomuser.me/api/portraits/men/34.jpg",
    },
    {
        id: 5,
        name: "Samanthi Rajapaksha",
        location: "Nuwara Eliya",
        rating: 4,
        comment: "Fast appointment booking and nationwide coverage made it very easy.",
        photo: "https://randomuser.me/api/portraits/women/55.jpg",
    },
]

export function Testimonials() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <section className="py-16 px-6 lg:px-20 bg-transparent border-t border-border/40 min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </section>
        )
    }

    return (
        <section className="py-16 px-6 lg:px-20 bg-transparent border-t border-border/40">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-third to-secondary bg-clip-text text-transparent py-2">
                    What Our Clients Say
                </h2>

                <div className="flex justify-center mt-2">
                    <div className="h-[3px] w-24 bg-gradient-to-r from-secondary to-accent rounded-full" />
                </div>

                <p className="text-muted-foreground mt-4 text-lg">
                    Hear directly from our satisfied clients about their experiences with Century Lands & Homes.
                </p>
            </div>

            {/* Carousel */}
            <div className="container mx-auto relative">

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={16}
                    loop={true}
                    speed={6000} // Slow speed for continuous effect
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1.1, spaceBetween: 16 },
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    className="pb-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
                    wrapperClass="!ease-linear" // Force linear easing for continuous marquee effect
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id} className="h-auto">
                            <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-sm hover:shadow-md border border-border/50 transition-all duration-300 flex flex-col h-full mx-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/10 shrink-0">
                                        <Image
                                            src={review.photo}
                                            alt={review.name}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-foreground">{review.name}</h4>
                                        <p className="text-sm text-muted-foreground font-medium">{review.location}</p>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <p className="text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                                </div>

                                <div className="flex items-center gap-1 mt-6 pt-6 border-t border-border/30">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? "text-accent fill-accent" : "text-muted-foreground/30"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}
