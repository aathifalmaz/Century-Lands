"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, MapPin, Home, DollarSign } from "lucide-react"

export function SearchFilter() {
    return (
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200
  bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 md:hover:scale-[1.02] transition-transform duration-500">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                {/* Property Type */}
                <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="type" className="text-white font-semibold uppercase tracking-wide flex items-center gap-2">
                        <Home className="h-4 w-4 text-white" /> Property Type
                    </Label>
                    <Select defaultValue="land">
                        <SelectTrigger id="type" className="h-12 bg-white/80 backdrop-blur-sm border border-muted hover:border-secondary transition-colors text-primary">
                            <SelectValue placeholder="Select Type" />
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

                {/* Location */}
                <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="location" className="text-white font-semibold uppercase tracking-wide flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white" /> Location
                    </Label>
                    <Input
                        id="location"
                        placeholder="City, District or Zip"
                        className="h-12 pl-4 pr-10 bg-white/80 backdrop-blur-sm border border-muted hover:border-secondary transition-colors placeholder:text-muted-foreground/70"
                    />
                </div>

                {/* Price Range */}
                <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="price" className="text-white font-semibold uppercase tracking-wide flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-white" /> Price Range
                    </Label>
                    <Select>
                        <SelectTrigger id="price" className="h-12 bg-white/80 backdrop-blur-sm border border-muted hover:border-secondary transition-colors text-primary">
                            <SelectValue placeholder="Any Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any Price</SelectItem>
                            <SelectItem value="low">Under 1M LKR</SelectItem>
                            <SelectItem value="mid">1M - 5M LKR</SelectItem>
                            <SelectItem value="high">5M - 10M LKR</SelectItem>
                            <SelectItem value="luxury-1">10M - 20M LKR</SelectItem>
                            <SelectItem value="luxury-2">20M - 50M LKR</SelectItem>
                            <SelectItem value="luxury-3">50M+ LKR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2">
                    <Button
                        className="w-full h-12 text-lg font-bold bg-primary text-white shadow-lg hover:bg-secondary hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl border border-white/10 flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10">Search</span>
                    </Button>
                </div>
            </div>
        </div>

    )
}
