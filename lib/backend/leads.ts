import { supabase } from "@/lib/supabase"

export interface Lead {
    id: number
    name: string
    email?: string
    phone: string
    interest: string
    budget?: string
    stage: 'New' | 'Contacted' | 'Qualified' | 'Negotiation' | 'Closed'
    source?: string
    created_at?: string
    date?: string
}

// Resilient Helper: LocalStorage fallback
const getLocalLeads = (): Lead[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('century_leads')
    return stored ? JSON.parse(stored) : []
}

const saveLocalLeads = (leads: Lead[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('century_leads', JSON.stringify(leads))
}

export async function getLeads(): Promise<Lead[]> {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return (data || []).map(item => ({
            ...item,
            date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : ""
        }))
    } catch (err: any) {
        console.warn("Supabase Leads table failed (likely doesn't exist yet). Falling back to LocalStorage.", err.message)
        const local = getLocalLeads()
        return local
    }
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'date'>): Promise<Lead> {
    try {
        const { data, error } = await supabase
            .from('leads')
            .insert({
                ...lead,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error
        return {
            ...data,
            date: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : ""
        }
    } catch (err: any) {
        console.warn("Supabase createLead failed. Saving to LocalStorage instead.", err.message)
        const local = getLocalLeads()
        const newId = local.length > 0 ? Math.max(...local.map(l => l.id)) + 1 : 1
        const newLead: Lead = {
            ...lead,
            id: newId,
            created_at: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
        }
        local.push(newLead)
        saveLocalLeads(local)
        return newLead
    }
}

export async function updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    try {
        const { data, error } = await supabase
            .from('leads')
            .update(lead)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return {
            ...data,
            date: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : ""
        }
    } catch (err: any) {
        console.warn("Supabase updateLead failed. Updating in LocalStorage instead.", err.message)
        const local = getLocalLeads()
        const index = local.findIndex(l => l.id === id)
        if (index !== -1) {
            local[index] = {
                ...local[index],
                ...lead
            }
            saveLocalLeads(local)
            return local[index]
        }
        throw new Error("Lead not found")
    }
}

export async function deleteLead(id: number): Promise<void> {
    try {
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id)

        if (error) throw error
    } catch (err: any) {
        console.warn("Supabase deleteLead failed. Deleting from LocalStorage instead.", err.message)
        const local = getLocalLeads()
        const updated = local.filter(l => l.id !== id)
        saveLocalLeads(updated)
    }
}
