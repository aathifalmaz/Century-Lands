"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SlidersHorizontal, RotateCcw } from "lucide-react"

export default function PropertiesFilterSidebar() {
    const [price, setPrice] = useState([50000, 500000])
    const [sqft, setSqft] = useState([500, 5000])
    const [propertyType, setPropertyType] = useState("")
    const [amenities, setAmenities] = useState<string[]>([])

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

    const resetFilters = () => {
        setPrice([50000, 500000])
        setSqft([500, 5000])
        setPropertyType("")
        setAmenities([])
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
                        <Label className="text-xs">Search Location</Label>
                        <Input placeholder="City, area, or address" className="h-9 text-sm" />
                    </div>

                    <Separator />

                    {/* Price Range */}
                    <div className="space-y-3">
                        <Label className="text-xs">Price Range</Label>

                        <Slider
                            value={price}
                            min={0}
                            max={1000000}
                            step={10000}
                            onValueChange={(value) => setPrice(value)}
                        />

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>${price[0].toLocaleString()}</span>
                            <span>${price[1].toLocaleString()}</span>
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

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                                        className="text-xs font-normal"
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
                    <Button className="w-full rounded-xl h-9 text-sm font-medium shadow-lg hover:bg-secondary hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                        Apply Filters
                    </Button>
                </div>
            </Card>
        </aside>
    )
}

