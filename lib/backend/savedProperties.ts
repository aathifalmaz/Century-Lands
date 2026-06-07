import { supabase } from "@/lib/supabase"

export async function getSavedProperties(userId: string) {
    const { data, error } = await supabase
        .from('saved_properties')
        .select(`
            id,
            property_id,
            properties (
                id,
                title,
                tagline,
                location,
                address,
                price,
                beds,
                baths,
                size,
                land_size,
                property_type,
                status,
                property_images (url)
            )
        `)
        .eq('user_id', userId)

    if (error) {
        console.error("Error fetching saved properties:", error)
        return []
    }

    return (data || []).map((item: any) => {
        const p = item.properties
        if (!p) return null
        return {
            ...p,
            images: p.property_images?.map((img: any) => img.url) || [],
            savedRecordId: item.id
        }
    }).filter(Boolean)
}

export async function saveProperty(userId: string, propertyId: number) {
    const { data, error } = await supabase
        .from('saved_properties')
        .upsert({
            user_id: userId,
            property_id: propertyId
        }, { onConflict: 'user_id,property_id' })
        .select()
        .single()

    if (error) {
        console.error("Error saving property:", error)
        throw error
    }
    return data
}

export async function unsaveProperty(userId: string, propertyId: number) {
    const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId)

    if (error) {
        console.error("Error unsaving property:", error)
        throw error
    }
    return true
}

export async function isPropertySaved(userId: string, propertyId: number) {
    const { data, error } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .maybeSingle()

    if (error) {
        console.error("Error checking saved property:", error)
        return false
    }
    return !!data
}
