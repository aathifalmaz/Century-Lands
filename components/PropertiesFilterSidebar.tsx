"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SlidersHorizontal, RotateCcw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PropertiesFilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchLocation, setSearchLocation] = useState("")
    const [price, setPrice] = useState([0, 150000000])
    const [sqft, setSqft] = useState([0, 10000])
    const [propertyType, setPropertyType] = useState("all")
    const [amenities, setAmenities] = useState<string[]>([])

    // Load initial values from searchParams
    useEffect(() => {
        setSearchLocation(searchParams.get("location") || "")
        
        const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : 0
        const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : 150000000
        setPrice([minPrice, maxPrice])

        const minSize = searchParams.get("minSize") ? parseInt(searchParams.get("minSize")!) : 0
        const maxSize = searchParams.get("maxSize") ? parseInt(searchParams.get("maxSize")!) : 10000
        setSqft([minSize, maxSize])

        setPropertyType(searchParams.get("propertyType") || "all")

        const ams = searchParams.get("amenities")
        setAmenities(ams ? ams.split(",") : [])
    }, [searchParams])

    const amenityList = [
        "Swimming Pool",
        "Gym",
        "Parking",
        "Garden",
        "Security",
        "Air Conditioning",
    ]

    const toggleAmenity = (item: string) => {
        setAmenities((prev) =>
            prev.includes(item)
                ? prev.filter((a) => a !== item)
                : [...prev, item]
        )
    }

    const handleApplyFilters = () => {
        const params = new URLSearchParams()
        if (searchLocation.trim()) params.set("location", searchLocation.trim())
        if (price[0] > 0) params.set("minPrice", price[0].toString())
        if (price[1] < 150000000) params.set("maxPrice", price[1].toString())
        if (sqft[0] > 0) params.set("minSize", sqft[0].toString())
        if (sqft[1] < 10000) params.set("maxSize", sqft[1].toString())
        if (propertyType && propertyType !== "all") params.set("propertyType", propertyType)
        if (amenities.length > 0) params.set("amenities", amenities.join(","))

        router.push(`/properties?${params.toString()}`)
    }

    const resetFilters = () => {
        setSearchLocation("")
        setPrice([0, 150000000])
        setSqft([0, 10000])
        setPropertyType("all")
        setAmenities([])
        router.push("/properties")
    }

    const formatPriceLabel = (val: number) => {
        if (val >= 1000000) {
            return `${(val / 1000000).toFixed(0)}M LKR`
        }
        return `${val.toLocaleString()} LKR`
    }

    return (
        <aside className="w-full lg:w-[300px]">
            <Card className="sticky top-24 border-none shadow-xl bg-white/70 dark:bg-black/40 backdrop-blur-xl flex flex-col max-h-[calc(100vh-7rem)]">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-3 shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </CardTitle>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetFilters}
                        className="h-7 w-7"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                </CardHeader>

                {/* Scrollable filter content */}
                <CardContent className="space-y-4 px-4 pb-2 overflow-y-auto flex-1">
                    {/* Search */}
                    <div className="space-y-1.5">
                        <Label className="text-xs">Search Location / Keyword</Label>
                        <Input 
                            placeholder="City, area, or address" 
                            className="h-9 text-sm" 
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                    </div>

                    <Separator />

                    {/* Price Range */}
                    <div className="space-y-3">
                        <Label className="text-xs">Price Range</Label>

                        <Slider
                            value={price}
                            min={0}
                            max={150000000}
                            step={1000000}
                            onValueChange={(value) => setPrice(value)}
                        />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatPriceLabel(price[0])}</span>
                            <span>{formatPriceLabel(price[1])}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Square Feet Range */}
                    <div className="space-y-3">
                        <Label className="text-xs">Size (sqft)</Label>

                        <Slider
                            value={sqft}
                            min={0}
                            max={10000}
                            step={100}
                            onValueChange={(value) => setSqft(value)}
                        />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{sqft[0].toLocaleString()} sqft</span>
                            <span>{sqft[1].toLocaleString()} sqft</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Property Type */}
                    <div className="space-y-1.5">
                        <Label className="text-xs">Property Type</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="land">Lands / Plots</SelectItem>
                                <SelectItem value="house">Houses</SelectItem>
                                <SelectItem value="apartment">Apartments</SelectItem>
                                <SelectItem value="villa">Villas</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="guest-house">Guest Houses</SelectItem>
                                <SelectItem value="cabanas">Cabanas</SelectItem>
                                <SelectItem value="hotel">Hotels</SelectItem>
                                <SelectItem value="shop">Shops</SelectItem>
                                <SelectItem value="estate">Estates</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Amenities */}
                    <div className="space-y-2">
                        <Label className="text-xs">Amenities</Label>

                        <div className="space-y-1.5">
                            {amenityList.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={item}
                                        checked={amenities.includes(item)}
                                        onCheckedChange={() => toggleAmenity(item)}
                                        className="h-3.5 w-3.5"
                                    />
                                    <Label
                                        htmlFor={item}
                                        className="text-xs font-normal cursor-pointer select-none"
                                    >
                                        {item}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>

                {/* Pinned CTA */}
                <div className="px-4 py-3 border-t border-border/40 shrink-0">
                    <Button 
                        onClick={handleApplyFilters}
                        className="w-full rounded-xl h-9 text-sm font-medium shadow-lg hover:bg-secondary hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-primary text-white"
                    >
                        Apply Filters
                    </Button>
                </div>
            </Card>
        </aside>
    )
}
