import { BedDouble, Bath, Maximize, LandPlot, Car, CalendarDays } from "lucide-react"

interface PropertyFeaturesProps {
    beds: number
    baths: number
    size: string
    landSize: string
    parking: number
    yearBuilt: number
}

export function PropertyFeatures({
    beds = 0,
    baths = 0,
    size = "0",
    landSize = "N/A",
    parking = 0,
    yearBuilt = 2024,
}: PropertyFeaturesProps) {
    const features = [
        { icon: BedDouble, label: "Bedrooms", value: beds },
        { icon: Bath, label: "Bathrooms", value: baths },
        { icon: Maximize, label: "Floor Area", value: size },
        { icon: LandPlot, label: "Land Size", value: landSize },
        { icon: Car, label: "Parking", value: `${parking} Spots` },
        { icon: CalendarDays, label: "Year Built", value: yearBuilt },
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {features.map((feat) => (
                <div
                    key={feat.label}
                    className="flex flex-col items-center text-center gap-1.5 p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-border/40 backdrop-blur-sm"
                >
                    <feat.icon className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                    <span className="text-xs text-muted-foreground">{feat.label}</span>
                    <span className="text-base font-semibold text-foreground">{feat.value}</span>
                </div>
            ))}
        </div>
    )
}
