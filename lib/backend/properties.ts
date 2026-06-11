import { supabase } from "@/lib/supabase"
import { deleteR2FileAction } from "@/lib/actions/auth"

export interface Property {
    id: string
    title: string
    tagline?: string
    location: string
    address?: string
    price: string
    beds: number
    baths: number
    size: string
    land_size?: string
    property_type: string
    status: string
    description?: string
    parking_spots?: number
    year_built?: number
    listing_id?: string
    furnishing?: string
    ownership?: string
    agent_id?: string
    created_at: string
    images?: string[]
}

export async function getProperties() {
    const { data, error } = await supabase
        .from('properties')
        .select(`
            *,
            property_images (url),
            property_amenities (amenity)
        `)
        .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(p => ({
        ...p,
        images: p.property_images?.map((img: any) => img.url) || [],
        amenities: p.property_amenities?.map((a: any) => a.amenity) || [],
        propertyType: p.property_type // for camelCase compatibility
    }))
}

import { getSupabaseAdmin } from "@/lib/supabase"

export async function getHomeStats() {
    try {
        // 1. Total Properties
        const { count: propertyCount } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })

        // 2. Sold Properties
        const { count: soldCount } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Sold')

        // 3. Cities Covered (Unique Locations)
        const { data: properties } = await supabase
            .from('properties')
            .select('location')

        // Extract last part of location as city
        const cities = new Set(properties?.map(p => {
            if (!p.location) return null
            const parts = p.location.split(',')
            return parts[parts.length - 1].trim()
        }).filter(Boolean) || [])

        // 4. User Signups (Happy Clients)
        let clientsCount = 0

        // Try to get real user count using Admin client (Server-side only)
        if (typeof window === 'undefined') {
            try {
                const adminClient = getSupabaseAdmin()
                const { data: { users }, error } = await adminClient.auth.admin.listUsers()
                if (!error && users) {
                    clientsCount = users.length
                }
            } catch (err) {
                console.error('Error fetching real user count:', err)
            }
        }

        // Fallback or addition if needed (in case inquiries/appointments are not users)
        // If users are 0, we can fall back to inquiries + appointments
        if (clientsCount === 0) {
            const { count: inquiryCount } = await supabase
                .from('inquiries')
                .select('*', { count: 'exact', head: true })

            const { count: appointmentCount } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })

            clientsCount = (inquiryCount || 0) + (appointmentCount || 0)
        }

        return {
            propertiesCount: propertyCount || 0,
            soldPropertiesCount: soldCount || 0,
            citiesCount: cities.size || 0,
            clientsCount: clientsCount
        }
    } catch (error) {
        console.error('Error fetching home stats:', error)
        return {
            propertiesCount: 0,
            soldPropertiesCount: 0,
            citiesCount: 0,
            clientsCount: 0
        }
    }
}

export async function getFeaturedProperties(limit = 8) {
    const { data, error } = await supabase
        .from('properties')
        .select(`
            *,
            property_images (url)
        `)
        .limit(limit)
        .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(p => ({
        ...p,
        images: p.property_images?.map((img: any) => img.url) || [],
        image: p.property_images?.[0]?.url || "/mock/1.jpg"
    }))
}

export async function getPropertyById(id: string) {
    const { data, error } = await supabase
        .from('properties')
        .select(`
            *,
            agents (*),
            property_images (*),
            property_amenities (*),
            nearby_places (*)
        `)
        .eq('id', id)
        .single()

    if (error) throw error
    if (!data) return null

    return {
        ...data,
        images: data.property_images?.map((img: any) => img.url) || [],
        amenities: data.property_amenities?.map((a: any) => a.amenity) || [],
        agent: data.agents,
        pricePerSqft: data.size && !isNaN(parseFloat(data.size)) && data.price
            ? (parseFloat(data.price.replace(/[^0-9.]/g, '')) / parseFloat(data.size)).toFixed(0)
            : "0"
    }
}

export async function getAgents() {
    const { data, error } = await supabase
        .from('agents')
        .select('*')

    if (error) throw error
    return data || []
}

export async function createProperty(property: any, images: string[]) {
    // 1. Prepare valid payload
    const baseSlug = property.title ? property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'prop'
    const slug = `${baseSlug}-${Date.now()}`
    
    // Create a copy and remove invalid schema fields if present from frontend
    const payload = { ...property }
    delete payload.district
    
    // Map parking_spots to parking
    if (payload.parking_spots !== undefined) {
        payload.parking = payload.parking_spots
        delete payload.parking_spots
    }

    // Insert property
    const { data: prop, error: pError } = await supabase
        .from('properties')
        .insert({
            ...payload,
            slug
        })
        .select()
        .single()

    if (pError) throw new Error(pError.message || "Failed to insert property")

    // 2. Insert images
    if (images.length > 0) {
        const imageRecords = images.map((url, index) => ({
            property_id: prop.id,
            url: url,
            order_index: index
        }))
        const { error: iError } = await supabase
            .from('property_images')
            .insert(imageRecords)
        if (iError) throw new Error(iError.message || "Failed to insert images")
    }

    // Auto-sync sales record if property is set to Sold
    try {
        await syncSalesRecord(prop.id.toString(), prop)
    } catch (err) {
        console.error("Error auto-syncing sales record for new property:", err)
    }

    return prop
}

export async function updateProperty(id: string, property: any, images: string[]) {
    // 1. Prepare valid payload
    const payload = { ...property }
    delete payload.district
    
    // Map parking_spots to parking
    if (payload.parking_spots !== undefined) {
        payload.parking = payload.parking_spots
        delete payload.parking_spots
    }

    // Update property
    const { error: pError } = await supabase
        .from('properties')
        .update({
            ...payload
        })
        .eq('id', id)

    if (pError) throw pError

    // 2. Sync images
    try {
        // Fetch old images to check what needs to be deleted from R2
        const { data: oldImgs } = await supabase
            .from('property_images')
            .select('url')
            .eq('property_id', parseInt(id))

        if (oldImgs && oldImgs.length > 0) {
            const toDelete = oldImgs.filter(oldImg => !images.includes(oldImg.url))
            if (toDelete.length > 0) {
                await Promise.all(toDelete.map(img => deleteR2FileAction(img.url)))
            }
        }
    } catch (err) {
        console.error("Error syncing property images in R2 during update:", err)
    }

    // Delete old
    const { error: dError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', id)

    if (dError) throw dError

    // Insert new
    if (images.length > 0) {
        const imageRecords = images.map((url, index) => ({
            property_id: id,
            url: url,
            order_index: index
        }))
        const { error: iError } = await supabase
            .from('property_images')
            .insert(imageRecords)
        if (iError) throw iError
    }

    // Auto-sync sales record if property is set to Sold
    try {
        await syncSalesRecord(id, property)
    } catch (err) {
        console.error("Error auto-syncing sales record for updated property:", err)
    }
}

export async function deleteProperty(id: string) {
    // Fetch associated property images to delete from R2
    try {
        const { data: imgs } = await supabase
            .from('property_images')
            .select('url')
            .eq('property_id', parseInt(id))
            
        if (imgs && imgs.length > 0) {
            await Promise.all(imgs.map(img => deleteR2FileAction(img.url)))
        }
    } catch (err) {
        console.error("Error deleting property images from R2:", err)
    }

    // Before deleting property, delete any associated sales records
    try {
        await supabase
            .from('sales_records')
            .delete()
            .eq('property_id', parseInt(id))
    } catch (err) {
        console.error("Error cleaning up sales records before deleting property:", err)
    }

    const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

    if (error) throw error
}

async function syncSalesRecord(propertyId: string, property: any) {
    const numericId = parseInt(propertyId)
    if (isNaN(numericId)) return

    if (property.status === "Sold") {
        // Check if sales record already exists for this property
        const { data: existingRecord } = await supabase
            .from('sales_records')
            .select('id, sold_price, commission_percentage, commission_amount')
            .eq('property_id', numericId)
            .maybeSingle()

        const originalPriceStr = property.price || "0"
        const cleanedPrice = parseFloat(originalPriceStr.replace(/[^0-9.]/g, '')) || 0
        const percentage = 5
        const commission = (cleanedPrice * percentage) / 100

        const recordPayload = {
            property_id: numericId,
            title: property.title || "Untitled Property",
            original_price: originalPriceStr,
            sold_price: cleanedPrice,
            commission_percentage: percentage,
            commission_amount: commission,
            sale_date: new Date().toISOString().split('T')[0]
        }

        if (existingRecord) {
            // Keep existing values if it already exists, so if they edited in the account page, it's preserved.
            await supabase
                .from('sales_records')
                .update({
                    title: recordPayload.title,
                    original_price: recordPayload.original_price,
                    sold_price: existingRecord.sold_price || recordPayload.sold_price,
                    commission_percentage: existingRecord.commission_percentage || recordPayload.commission_percentage,
                    commission_amount: existingRecord.commission_amount || recordPayload.commission_amount,
                })
                .eq('id', existingRecord.id)
        } else {
            await supabase
                .from('sales_records')
                .insert(recordPayload)
        }
    } else {
        // Delete record if status was changed away from Sold
        await supabase
            .from('sales_records')
            .delete()
            .eq('property_id', numericId)
    }
}
