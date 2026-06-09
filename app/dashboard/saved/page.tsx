"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NextImage from "next/image"
import Link from "next/link"
import { BedDouble, Bath, Maximize, Heart, MapPin, Trash2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getSavedProperties, unsaveProperty } from "@/lib/backend/savedProperties"
import { toast } from "sonner"

export default function SavedPropertiesPage() {
    const [user, setUser] = useState<any>(null)
    const [savedProperties, setSavedProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUserAndLoad = async () => {
            setLoading(true)
            try {
                const { data: { session } } = await supabase.auth.getSession()
                const loggedInUser = session?.user ?? null
                setUser(loggedInUser)

                if (loggedInUser) {
                    const data = await getSavedProperties(loggedInUser.id)
                    setSavedProperties(data)
                }
            } catch (error: any) {
                console.error("Error loading saved properties:", error)
                toast.error("Failed to load saved properties: " + (error.message || "Unknown error"))
            } finally {
                setLoading(false)
            }
        }
        checkUserAndLoad()
    }, [])

    const handleRemove = async (propertyId: number) => {
        if (!user) return

        try {
            await unsaveProperty(user.id, propertyId)
            setSavedProperties(prev => prev.filter(p => p.id !== propertyId))
            toast.success("Removed from favorites successfully!")
        } catch (error: any) {
            console.error("Remove saved property error:", error)
            toast.error("Failed to remove property: " + (error.message || "Unknown error"))
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-third">Saved Properties</h1>
                    <p className="text-muted-foreground mt-1">Properties you&apos;ve favorited for later review.</p>
                </div>
            </div>

            {savedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedProperties.map((property) => (
                        <div
                            key={property.id}
                            className="group h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-border/50 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500"
                        >
                            {/* Image */}
                            <div className="relative h-60 overflow-hidden">
                                <NextImage
                                    src={property.images[0] || "/mock/1.jpg"}
                                    alt={property.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                                {/* Heart Button Overlay (Clicking removes it) */}
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={() => handleRemove(property.id)}
                                    className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-sm z-10"
                                >
                                    <Heart className="h-4 w-4 fill-current animate-pulse" />
                                </Button>

                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 shadow-sm z-10">
                                    <span className="text-sm font-bold text-primary">{property.price}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-1">
                                        {property.title}
                                    </h3>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                        <MapPin size={14} className="text-accent" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-border/40">
                                    <Badge variant="outline" className="flex lg:flex-row flex-col items-center gap-1 px-1 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium rounded-md w-full justify-center text-[11px]">
                                        <BedDouble size={14} className="text-secondary" />
                                        <span>{property.beds} Beds</span>
                                    </Badge>
                                    <Badge variant="outline" className="flex lg:flex-row flex-col items-center gap-1 px-1 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium rounded-md w-full justify-center text-[11px]">
                                        <Bath size={14} className="text-secondary" />
                                        <span>{property.baths} Baths</span>
                                    </Badge>
                                    <Badge variant="outline" className="flex lg:flex-row flex-col items-center gap-1 px-1 py-1 border-border/60 bg-secondary/5 text-muted-foreground font-medium rounded-md w-full justify-center text-[11px]">
                                        <Maximize size={14} className="text-secondary" />
                                        <span>{property.size}</span>
                                    </Badge>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <Button asChild className="flex-1 bg-primary hover:bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300">
                                        <Link href={`/properties/${property.id}`}>View Details</Link>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        onClick={() => handleRemove(property.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-10 w-10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No saved properties yet</h3>
                    <p className="text-gray-500 text-sm mt-1 mb-4">Start browsing properties to add them to your favorites.</p>
                    <Link href="/properties">
                        <Button className="bg-primary hover:bg-secondary text-white rounded-xl">Browse Properties</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
