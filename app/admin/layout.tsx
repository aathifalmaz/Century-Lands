"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AdminNavbar } from "@/components/admin/AdminNavbar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const activeUser = session?.user ?? null
            
            if (!activeUser) {
                router.replace("/login")
                return
            }

            const isAdmin = activeUser.user_metadata?.role?.toLowerCase() === "admin"
            if (!isAdmin) {
                toast.error("Access Denied: You do not have permission to access the admin portal.")
                router.replace("/")
            } else {
                setAuthorized(true)
            }
            setLoading(false)
        }
        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            </div>
        )
    }

    if (!authorized) {
        return null
    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-[80] bg-gray-900">
                <AdminSidebar />
            </div>
            <main className="lg:pl-72">
                <AdminNavbar />
                {children}
            </main>
        </div>
    )
}
