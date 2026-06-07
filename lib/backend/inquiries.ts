import { supabase } from "@/lib/supabase"

export interface Inquiry {
    id: number
    name: string
    email: string
    phone: string
    property_id?: string
    property_title: string
    message: string
    reply?: string
    status: string
    created_at: string
}

export async function getInquiries() {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export async function getInquiriesByEmail(email: string) {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export async function createInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
        .from('inquiries')
        .insert({
            ...inquiry,
            status: 'New'
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateInquiryStatus(id: number, status: string) {
    const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)

    if (error) throw error
}

export async function updateInquiryReply(id: number, reply: string) {
    const { error } = await supabase
        .from('inquiries')
        .update({ 
            reply,
            status: 'Replied'
        })
        .eq('id', id)

    if (error) throw error
}
