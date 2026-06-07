import { MapPin, School, Hospital, ShoppingCart, Palmtree, Landmark } from "lucide-react"

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Beach: Palmtree,
    School: School,
    Hospital: Hospital,
    Supermarket: ShoppingCart,
    Shopping: ShoppingCart,
    Landmark: Landmark,
    "City Center": MapPin,
}

interface LocationMapProps {
    coordinates: { lat: number; lng: number }
    nearbyPlaces: { name: string; distance: string; type: string }[]
    address: string
}

export function LocationMap({ coordinates, nearbyPlaces, address }: LocationMapProps) {
    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}&zoom=15`

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Location</h2>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                {address}
            </div>

            {/* Map embed */}
            <div className="rounded-xl overflow-hidden border border-border/40 shadow-sm">
                <iframe
                    src={mapSrc}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                />
            </div>

            {/* Nearby Places */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Nearby Places</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nearbyPlaces.map((place) => {
                        const Icon = typeIcons[place.type] || MapPin
                        return (
                            <div
                                key={place.name}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-border/40"
                            >
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 shrink-0">
                                    <Icon className="h-4 w-4 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{place.name}</p>
                                    <p className="text-xs text-muted-foreground">{place.distance}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
