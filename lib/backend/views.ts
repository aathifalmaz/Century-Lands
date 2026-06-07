import { supabase } from "@/lib/supabase"

export async function recordPropertyView(propertyId: string | number) {
    try {
        const { error } = await supabase
            .from('property_views')
            .insert({
                property_id: Number(propertyId)
            })

        if (error) {
            console.error('Error recording property view:', error)
        }
    } catch (err) {
        console.error('Catch error recording property view:', err)
    }
}
