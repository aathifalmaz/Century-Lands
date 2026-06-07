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
    beds,
    baths,
    size,
    landSize,
    parking,
    yearBuilt,
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
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {features.map((feat) => (
                <div
                    key={feat.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-border/40 backdrop-blur-sm"
                >
                    <feat.icon className="h-6 w-6 text-secondary" />
                    <span className="text-sm text-muted-foreground">{feat.label}</span>
                    <span className="text-lg font-semibold text-foreground">{feat.value}</span>
                </div>
            ))}
        </div>
    )
}
