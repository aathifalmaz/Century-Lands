import { Navbar } from "@/components/Navbar"
import PropertiesFilterSidebar from "@/components/PropertiesFilterSidebar"
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { Footer } from "@/components/Footer"
import { PropertyListings } from "@/components/PropertyListings"
import { isSupabaseConfigured } from "@/lib/supabase"
import { getProperties } from "@/lib/backend/properties"

export const dynamic = 'force-dynamic'

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<{
        location?: string
        minPrice?: string
        maxPrice?: string
        minSize?: string
        maxSize?: string
        propertyType?: string
        amenities?: string
    }>
}) {
    let propertiesData: any[] = []

    if (isSupabaseConfigured) {
        try {
            propertiesData = await getProperties()
        } catch (error) {
            console.error('Error fetching properties:', error)
        }
    }

    const params = await searchParams
    const locationQuery = params.location || ""
    const minPriceQuery = params.minPrice ? parseFloat(params.minPrice) : null
    const maxPriceQuery = params.maxPrice ? parseFloat(params.maxPrice) : null
    const minSizeQuery = params.minSize ? parseFloat(params.minSize) : null
    const maxSizeQuery = params.maxSize ? parseFloat(params.maxSize) : null
    const propertyTypeQuery = params.propertyType || ""
    const amenitiesQuery = params.amenities ? params.amenities.split(",") : []

    // Helper functions for parsing text to numbers safely
    const parsePrice = (priceStr: string): number => {
        if (!priceStr) return 0
        const cleaned = priceStr.replace(/[^0-9.]/g, "")
        return parseFloat(cleaned) || 0
    }

    const parseSize = (sizeStr: string): number => {
        if (!sizeStr) return 0
        const cleaned = sizeStr.replace(/[^0-9.]/g, "")
        return parseFloat(cleaned) || 0
    }

    // Filter logic
    let filtered = propertiesData.map((p: any) => ({
        id: p.id,
        title: p.title,
        location: p.location,
        price: p.price,
        beds: p.beds,
        baths: p.baths,
        size: p.size,
        image: p.images?.[0] || "/mock/1.jpg",
        propertyType: p.propertyType,
        amenities: p.amenities || []
    }))

    // 1. Search Location
    if (locationQuery) {
        const query = locationQuery.toLowerCase()
        filtered = filtered.filter(p => 
            (p.location || "").toLowerCase().includes(query) ||
            (p.title || "").toLowerCase().includes(query)
        )
    }

    // 2. Price Range
    if (minPriceQuery !== null) {
        filtered = filtered.filter(p => parsePrice(p.price) >= minPriceQuery)
    }
    if (maxPriceQuery !== null) {
        filtered = filtered.filter(p => parsePrice(p.price) <= maxPriceQuery)
    }

    // 3. Size Range
    if (minSizeQuery !== null) {
        filtered = filtered.filter(p => parseSize(p.size) >= minSizeQuery)
    }
    if (maxSizeQuery !== null) {
        filtered = filtered.filter(p => parseSize(p.size) <= maxSizeQuery)
    }

    // 4. Property Type
    if (propertyTypeQuery && propertyTypeQuery !== "all") {
        filtered = filtered.filter(p => 
            (p.propertyType || "").toLowerCase() === propertyTypeQuery.toLowerCase()
        )
    }

    // 5. Amenities
    if (amenitiesQuery.length > 0) {
        filtered = filtered.filter(p => 
            amenitiesQuery.every((amenity: string) => 
                p.amenities.some((a: string) => a.toLowerCase() === amenity.toLowerCase())
            )
        )
    }

    return (
        <>
            <Navbar forceScrolled />
            <BackgroundDecor />

            {/* Layout */}
            <section className="px-6 lg:px-20 pt-24 lg:pt-28 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

                    {/* Sidebar */}
                    <PropertiesFilterSidebar />

                    {/* Listings */}
                    <PropertyListings properties={filtered} />

                </div>
            </section>

            <Footer />
        </>
    )
}
