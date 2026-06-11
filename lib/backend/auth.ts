import { supabase } from "@/lib/supabase"

export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { data, error }
}

export async function signUpWithEmail(email: string, password: string, metadata: any = {}) {
    const options: any = {
        data: metadata,
    }
    if (typeof window !== 'undefined') {
        options.emailRedirectTo = window.location.origin + '/auth/callback'
    }
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
    })
    return { data, error }
}

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/auth/callback',
        },
    })
    if (error) throw error
    return data
}

export async function signOut() {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem("2fa_verified")
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
}

export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
}
