import { Navbar } from "@/components/Navbar"
import PropertiesFilterSidebar from "@/components/PropertiesFilterSidebar"
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { Footer } from "@/components/Footer"
import { PropertyListings } from "@/components/PropertyListings"
import { isSupabaseConfigured } from "@/lib/supabase"
import { getProperties } from "@/lib/backend/properties"

export const dynamic = 'force-dynamic'

export default async function PropertiesPage() {
    let propertiesData: any[] = []

    if (isSupabaseConfigured) {
        try {
            propertiesData = await getProperties()
        } catch (error) {
            console.error('Error fetching properties:', error)
        }
    }

    // Map service data to component props
    const formattedProperties = propertiesData.map((p: any) => ({
        id: p.id,
        title: p.title,
        location: p.location,
        price: p.price,
        beds: p.beds,
        baths: p.baths,
        size: p.size,
        image: p.images?.[0] || "/mock/1.jpg"
    }))

    return (
        <>
            <Navbar forceScrolled />
            <BackgroundDecor />

            {/* Layout */}
            <section className="px-6 lg:px-20 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

                    {/* Sidebar */}
                    <PropertiesFilterSidebar />

                    {/* Listings */}
                    <PropertyListings properties={formattedProperties} />

                </div>
            </section>

            <Footer />
        </>
    )
}
