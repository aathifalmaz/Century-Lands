"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertyGalleryProps {
    images: string[]
    title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    const goTo = (index: number) => {
        if (index < 0) setActiveIndex(images.length - 1)
        else if (index >= images.length) setActiveIndex(0)
        else setActiveIndex(index)
    }

    return (
        <>
            {/* Gallery: Main Image + Vertical Thumbnails */}
            <div className="flex flex-col md:flex-row gap-3 w-full max-w-full overflow-hidden">
                {/* Main Image */}
                <div className="relative w-full aspect-[16/10] md:aspect-auto h-auto md:h-[480px] md:flex-1 rounded-none md:rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                >
                    <Image
                        src={images[activeIndex]}
                        alt={`${title} - Image ${activeIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Expand icon */}
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                        <Expand className="h-5 w-5 text-primary" />
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1) }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-white hover:scale-110"
                    >
                        <ChevronLeft className="h-5 w-5 text-primary" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1) }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-white hover:scale-110"
                    >
                        <ChevronRight className="h-5 w-5 text-primary" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                        {activeIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Vertical thumbnail strip (desktop) / Horizontal (mobile) */}
                <div className="flex md:flex-col gap-3 w-full md:w-24 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto md:max-h-[420px] pb-1 md:pb-0 md:pr-1 p-1 scrollbar-thin px-6 md:px-0">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative shrink-0 w-20 h-14 md:w-full md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300",
                                activeIndex === index
                                    ? "border-primary ring-2 ring-primary/30 scale-105"
                                    : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black/95 border-none">
                    <DialogTitle className="sr-only">{title} — Image Gallery</DialogTitle>
                    <div className="relative w-full aspect-[16/10]">
                        <Image
                            src={images[activeIndex]}
                            alt={`${title} - Image ${activeIndex + 1}`}
                            fill
                            className="object-contain"
                        />

                        {/* Lightbox navigation */}
                        <button
                            onClick={() => goTo(activeIndex - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/40 transition-all"
                        >
                            <ChevronLeft className="h-6 w-6 text-white" />
                        </button>
                        <button
                            onClick={() => goTo(activeIndex + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/40 transition-all"
                        >
                            <ChevronRight className="h-6 w-6 text-white" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
                            {activeIndex + 1} / {images.length}
                        </div>
                    </div>

                    {/* Lightbox thumbnails */}
                    <div className="flex justify-center gap-2 p-4">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "relative shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all",
                                    activeIndex === index
                                        ? "border-white"
                                        : "border-transparent opacity-50 hover:opacity-80"
                                )}
                            >
                                <Image src={img} alt={`Thumb ${index + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
