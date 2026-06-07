import { getSupabaseAdmin } from '../lib/supabase'
const supabase = getSupabaseAdmin()

import { properties } from '../data/mockProperties'
import { mockAppointments } from '../data/mockAppointments'
import { mockSoldProperties } from '../data/mockAccounts'

// This script migrates mock data to Supabase.
// Run this via: npx ts-node scripts/seed-backend.ts

async function seed() {
    console.log('🚀 Starting data migration to Supabase...')

    // 1. Seed Agents (Unique set)
    const uniqueAgents = Array.from(new Set(properties.map(p => JSON.stringify(p.agent))))
        .map(s => JSON.parse(s))

    console.log(`- Migrating ${uniqueAgents.length} agents...`)
    for (const agent of uniqueAgents) {
        const { data, error } = await supabase
            .from('agents')
            .upsert({
                name: agent.name,
                company: agent.company,
                phone: agent.phone,
                email: agent.email,
                whatsapp: agent.whatsapp,
                photo_url: agent.photo
            }, { onConflict: 'email' })
            .select()

        if (error) {
            console.error('Agent upload error:', {
                message: error.message,
                details: error.details,
                code: error.code,
                hint: error.hint
            })
        }
    }

    // 2. Seed Properties
    console.log(`- Migrating ${properties.length} properties...`)
    for (const prop of properties) {
        // Find agent ID
        const { data: agentData } = await supabase
            .from('agents')
            .select('id')
            .eq('email', prop.agent.email)
            .single()

        const { data: propData, error: propError } = await supabase
            .from('properties')
            .upsert({
                slug: prop.slug,
                title: prop.title,
                tagline: prop.tagline,
                location: prop.location,
                address: prop.address,
                price: prop.price,
                price_per_sqft: prop.pricePerSqft,
                status: prop.status,
                beds: prop.beds,
                baths: prop.baths,
                size: prop.size,
                land_size: prop.landSize,
                parking: prop.parking,
                year_built: prop.yearBuilt,
                property_type: prop.propertyType,
                listing_id: prop.listingId,
                furnishing: prop.furnishing,
                ownership: prop.ownership,
                description: prop.description,
                coordinates_lat: prop.coordinates.lat,
                coordinates_lng: prop.coordinates.lng,
                agent_id: agentData?.id
            }, { onConflict: 'slug' })
            .select()
            .single()

        if (propError) {
            console.error('Property upload error:', {
                message: propError.message,
                details: propError.details,
                code: propError.code,
                hint: propError.hint
            })
            continue
        }

        const propertyId = propData.id

        // Seed Images
        const imgInserts = prop.images.map((url, idx) => ({
            property_id: propertyId,
            url,
            order_index: idx
        }))
        await supabase.from('property_images').upsert(imgInserts)

        // Seed Amenities
        const amenityInserts = prop.amenities.map(a => ({
            property_id: propertyId,
            amenity: a
        }))
        await supabase.from('property_amenities').upsert(amenityInserts)

        // Seed Nearby Places
        const nearbyInserts = prop.nearbyPlaces.map(n => ({
            property_id: propertyId,
            name: n.name,
            distance: n.distance,
            type: n.type
        }))
        await supabase.from('nearby_places').upsert(nearbyInserts)
    }

    // 3. Seed Appointments
    console.log(`- Migrating ${mockAppointments.length} appointments...`)
    const appointmentInserts = mockAppointments.map(a => ({
        property_id: a.propertyId,
        property_title: a.propertyTitle,
        customer_name: a.customerName,
        email: a.email,
        agent_name: a.agentName,
        agent_phone: a.agentPhone,
        appointment_date: new Date(a.date).toISOString().split('T')[0],
        appointment_time: a.time,
        status: a.status,
        type: a.type,
        notes: a.notes
    }))
    await supabase.from('appointments').upsert(appointmentInserts)

    // 4. Seed Sales Records
    console.log(`- Migrating ${mockSoldProperties.length} sales records...`)
    for (const record of mockSoldProperties) {
        const { data: propData } = await supabase
            .from('properties')
            .select('id')
            .eq('slug', properties.find(p => p.id === record.propertyId)?.slug)
            .single()

        if (propData) {
            await supabase.from('sales_records').upsert({
                property_id: propData.id,
                title: record.title,
                original_price: record.originalPrice,
                sold_price: record.soldPrice,
                commission_percentage: record.commissionPercentage,
                commission_amount: record.commissionAmount,
                sale_date: record.saleDate
            })
        }
    }

    console.log('✅ Migration completed!')
}

seed().catch(console.error)
