"use client"

import Image from "next/image"
import Link from "next/link"
import { BedDouble, Bath, Maximize } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface PropertyListingItem {
    id: number
    title: string
    location: string
    price: string
    beds: number
    baths: number
    size: string
    image: string
}

interface PropertyListingsProps {
    properties: PropertyListingItem[]
}

export function PropertyListings({ properties }: PropertyListingsProps) {
    return (
        <div>
            {/* Page Header */}
            <section className="pt-0 pb-4 border-b border-border/40">
                <h1 className="text-3xl md:text-4xl font-bold text-third">
                    Browse Properties
                </h1>
                <p className="text-muted-foreground text-lg mt-2">
                    Discover verified lands & homes across Sri Lanka.
                </p>
            </section>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{properties.length}</span> properties
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {properties.map((property) => (
                    <div
                        key={property.id}
                        className="group h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-border/50 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500"
                    >
                        {/* Image */}
                        <div className="relative h-60 overflow-hidden">
                            <Image
                                src={property.image}
                                alt={property.title}
                                fill
                                className="object-cover group-hover:scale-110 transition duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 shadow-sm">
                                <span className="text-sm font-bold text-primary">{property.price}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-1">
                                    {property.title}
                                </h3>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-border/40">
                                <Badge variant="outline" className="flex lg:flex-row flex-col items-center gap-1.5 px-2 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium w-full justify-center text-[11px]">
                                    <BedDouble size={14} className="text-secondary" />
                                    <span>{property.beds} Beds</span>
                                </Badge>
                                <Badge variant="outline" className="flex lg:flex-row flex-col items-center gap-1.5 px-2 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium w-full justify-center text-[11px]">
                                    <Bath size={14} className="text-secondary" />
                                    <span>{property.baths} Baths</span>
                                </Badge>
                                <Badge variant="outline" className="flex lg:flex-row flex-col items-center gap-1.5 px-2 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium w-full justify-center text-[11px]">
                                    <Maximize size={14} className="text-secondary" />
                                    <span>{property.size}</span>
                                </Badge>
                            </div>

                            <Button asChild className="w-full mt-auto bg-primary hover:bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300">
                                <Link href={`/properties/${property.id}`}>View Details</Link>
                            </Button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}
