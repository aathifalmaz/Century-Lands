import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

export interface Appointment {
    id: number
    property_id: string
    property_title: string
    customer_name: string
    email: string
    phone?: string
    appointment_date: string
    appointment_time: string
    status?: string
    type: string
    notes: string
    created_at?: string
}

export async function getAppointments() {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })

    if (error) throw error
    return data || []
}

export async function getAppointmentsByEmail(email: string) {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('email', email)
        .order('appointment_date', { ascending: false })

    if (error) throw error
    return data || []
}

export async function createAppointment(appointment: Omit<Appointment, 'id'>) {
    const { data, error } = await supabase
        .from('appointments')
        .insert({
            ...appointment,
            status: appointment.status || 'Pending'
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateAppointmentStatus(id: number, status: string) {
    const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)

    if (error) throw error
}
