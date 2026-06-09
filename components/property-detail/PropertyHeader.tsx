import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PropertyHeaderProps {
    title: string
    tagline: string
    location: string
    address: string
    price: string
    pricePerSqft: string
    status: "Available" | "Under Offer" | "Sold" | "For Sale" | "For Rent"
}

export function PropertyHeader({
    title,
    tagline = "",
    location,
    address = "N/A",
    price,
    pricePerSqft = "0",
    status,
}: PropertyHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Left — Title & Location */}
            <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        {title}
                    </h1>
                    <Badge
                        className={cn(
                            "text-xs font-semibold px-3 py-1 rounded-full border-none",
                            status === "Available" && "bg-secondary/15 text-secondary",
                            status === "Under Offer" && "bg-amber-500/15 text-amber-600",
                            status === "Sold" && "bg-destructive/15 text-destructive",
                            status === "For Sale" && "bg-secondary/15 text-secondary",
                            status === "For Rent" && "bg-blue-500/15 text-blue-600"
                        )}
                    >
                        {status}
                    </Badge>
                </div>

                <p className="text-muted-foreground text-sm">{tagline}</p>
            </div>

            {/* Right — Price */}
            <div className="text-left md:text-right shrink-0">
                <p className="text-2xl md:text-3xl font-bold text-primary">{price}</p>
                <p className="text-sm text-muted-foreground mt-1">{pricePerSqft} / sqft</p>
            </div>
        </div>
    )
}
