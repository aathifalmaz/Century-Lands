import {
    Waves, Dumbbell, Car, Trees, ShieldCheck, Cctv,
    Droplets, Zap, Wifi, Flame, BookOpen, Wine,
    Fence, Sun, ChefHat, Shirt, Users, Snowflake,
    Home, Check
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "Swimming Pool": Waves,
    "Gym": Dumbbell,
    "Parking": Car,
    "Garden": Trees,
    "Security": ShieldCheck,
    "CCTV": Cctv,
    "Hot Water": Droplets,
    "Backup Generator": Zap,
    "Air Conditioning": Snowflake,
    "Rooftop Terrace": Sun,
    "Smart Home": Home,
    "Elevator": Home,
    "Concierge": Users,
    "High-Speed WiFi": Wifi,
    "Rooftop Lounge": Sun,
    "Co-Working Space": Users,
    "Laundry Room": Shirt,
    "Solar Panels": Sun,
    "Servant Quarters": Home,
    "Study Room": BookOpen,
    "Pantry": ChefHat,
    "Fireplace": Flame,
    "Wine Cellar": Wine,
    "Library": BookOpen,
    "Lake Access": Waves,
    "Outdoor Shower": Droplets,
    "BBQ Area": Flame,
    "Fence": Fence,
}

interface AmenitiesGridProps {
    amenities: string[]
}

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Amenities</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => {
                    const Icon = iconMap[amenity] || Check
                    return (
                        <div
                            key={amenity}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-border/40 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-secondary/10">
                                <Icon className="h-4 w-4 text-secondary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{amenity}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
