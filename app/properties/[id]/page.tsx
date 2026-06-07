import { Navbar } from "@/components/Navbar"
import { PropertyGallery } from "@/components/property-detail/PropertyGallery"
import { PropertyHeader } from "@/components/property-detail/PropertyHeader"
import { PropertyFeatures } from "@/components/property-detail/PropertyFeatures"
import { PropertyActions } from "@/components/property-detail/PropertyActions"
import { PropertyDescription } from "@/components/property-detail/PropertyDescription"
import { PropertyDetailsTable } from "@/components/property-detail/PropertyDetailsTable"
import { AmenitiesGrid } from "@/components/property-detail/AmenitiesGrid"
import { AgentCard } from "@/components/property-detail/AgentCard"
import { BookingDialog } from "@/components/property-detail/BookingDialog"
import { Footer } from "@/components/Footer"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { isSupabaseConfigured } from "@/lib/supabase"
import { getPropertyById } from "@/lib/backend/properties"
import { recordPropertyView } from "@/lib/backend/views"

export const dynamic = 'force-dynamic'

interface PropertyPageProps {
    params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
    const { id } = await params
    let property: any = null

    if (isSupabaseConfigured) {
        try {
            property = await getPropertyById(id)
            if (property) {
                // Record the view asynchronously
                recordPropertyView(id)
            }
        } catch (error) {
            console.error('Error fetching property:', error)
        }
    }

    if (!property) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar forceScrolled />

            <main className="container mx-auto px-6 lg:px-20 py-10 space-y-10">
                {/* 1️⃣ Image Gallery */}
                <PropertyGallery images={property.images} title={property.title} />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                    {/* Left Column — Content */}
                    <div className="space-y-10 max-w-4xl">
                        {/* 2️⃣ Title, Price & Location */}
                        <PropertyHeader
                            title={property.title}
                            tagline={property.tagline}
                            price={property.price}
                            pricePerSqft={property.pricePerSqft}
                            status={property.status}
                            address={property.address}
                            location={property.location}
                        />

                        <Separator className="bg-border/40" />

                        {/* 3️⃣ Key Features (Beds, Baths, etc.) */}
                        <PropertyFeatures
                            beds={property.beds}
                            baths={property.baths}
                            size={property.size}
                            landSize={property.land_size}
                            parking={property.parking_spots || 0}
                            yearBuilt={property.year_built || 2024}
                        />

                        <Separator className="bg-border/40" />

                        {/* 4️⃣ Property Description */}
                        <PropertyDescription description={property.description} />

                        <Separator className="bg-border/40" />

                        {/* 5️⃣ Property Details Table */}
                        <PropertyDetailsTable
                            listingId={property.listing_id}
                            propertyType={property.property_type}
                            landSize={property.land_size}
                            size={property.size}
                            furnishing={property.furnishing}
                            ownership={property.ownership}
                        />

                        <Separator className="bg-border/40" />

                        {/* 6️⃣ Amenities Grid */}
                        <AmenitiesGrid amenities={property.amenities} />
                    </div>

                    {/* Right Column — Actions & Agent */}
                    <aside className="space-y-6 sticky top-24">
                        {/* 7️⃣ Property Actions (Save, Share, Inquire) */}
                        <PropertyActions
                            propertyId={property.id}
                            phone={property.agent?.phone || ""}
                            whatsapp={property.agent?.phone || ""}
                            onBookAppointment={() => { }} // Managed by BookingDialog via state in client components if needed
                        />

                        {/* 8️⃣ Agent Information Card */}
                        <AgentCard agent={property.agent} />

                        {/* 9️⃣ Booking Dialog Button */}
                        <BookingDialog
                            propertyId={property.id}
                            propertyTitle={property.title}
                        />
                    </aside>
                </div>

                <Separator className="bg-border/40" />
            </main>

            <Footer />
        </div>
    )
}
