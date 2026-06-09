import Image from "next/image"
import Link from "next/link"
import { BedDouble, Bath, Maximize } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/backend/properties"

interface SimilarPropertiesProps {
    properties: Property[]
}

export function SimilarProperties({ properties }: SimilarPropertiesProps) {
    if (properties.length === 0) return null

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Similar Properties</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {properties.map((property) => (
                    <Link
                        key={property.id}
                        href={`/properties/${property.id}`}
                        className="group block"
                    >
                        <div className="rounded-2xl overflow-hidden bg-white border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={property.images?.[0] || "/mock/1.jpg"}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                                {/* Price Badge Overlay */}
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 shadow-sm z-10">
                                    <span className="text-sm font-bold text-primary">{property.price}</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4 space-y-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors line-clamp-1">
                                    {property.title}
                                </h3>

                                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40 mt-auto">
                                    <Badge variant="outline" className="flex flex-col items-center gap-1 px-1 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium rounded-md w-full justify-center text-[10px]">
                                        <BedDouble size={12} className="text-secondary" />
                                        <span>{property.beds} Beds</span>
                                    </Badge>
                                    <Badge variant="outline" className="flex flex-col items-center gap-1 px-1 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium rounded-md w-full justify-center text-[10px]">
                                        <Bath size={12} className="text-secondary" />
                                        <span>{property.baths} Baths</span>
                                    </Badge>
                                    <Badge variant="outline" className="flex flex-col items-center gap-1 px-1 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium rounded-md w-full justify-center text-[10px]">
                                        <Maximize size={12} className="text-secondary" />
                                        <span>{property.size}</span>
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
