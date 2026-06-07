import { supabase } from "@/lib/supabase"

export interface SalesRecord {
    id: number
    property_id: number
    title: string
    original_price: string
    sold_price: number
    commission_percentage: number
    commission_amount: number
    sale_date: string
}

export async function getSalesRecords() {
    const { data, error } = await supabase
        .from('sales_records')
        .select('*')
        .order('sale_date', { ascending: false })

    if (error) throw error
    return data || []
}

export async function updateSalesRecord(id: number, record: Partial<SalesRecord>) {
    const { error } = await supabase
        .from('sales_records')
        .update(record)
        .eq('id', id)

    if (error) throw error
}

export async function createSalesRecord(record: Omit<SalesRecord, 'id' | 'sale_date'> & { sale_date?: string }) {
    const { data, error } = await supabase
        .from('sales_records')
        .insert({
            ...record,
            sale_date: record.sale_date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteSalesRecordByPropertyId(propertyId: number) {
    const { error } = await supabase
        .from('sales_records')
        .delete()
        .eq('property_id', propertyId)

    if (error) throw error
}

export async function getAccountStats() {
    const { data, error } = await supabase
        .from('sales_records')
        .select('commission_amount')

    if (error) throw error

    const totalRevenue = data?.reduce((sum: number, s: any) => sum + (s.commission_amount || 0), 0) || 0
    const soldCount = data?.length || 0

    return { totalRevenue, soldCount }
}
