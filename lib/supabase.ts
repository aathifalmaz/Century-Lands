import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Robust check: must start with http to be considered "configured"
export const isSupabaseConfigured = !!supabaseUrl && supabaseUrl.startsWith('http') && !!supabaseAnonKey

// Browser-safe client with cookie support, fallback to standard client for non-browser/placeholder cases
export const supabase = typeof window !== 'undefined'
    ? createBrowserClient(
        supabaseUrl!,
        supabaseAnonKey!
    )
    : createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder'
    )

// Administration client for backend tasks (e.g. seeding)
export const getSupabaseAdmin = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey || serviceRoleKey === 'your-supabase-service-role-key') {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing or invalid. Please check your .env.local file.')
    }
    return createClient(supabaseUrl!, serviceRoleKey)
}
