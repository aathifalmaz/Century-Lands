"use client"

import { Navbar } from "@/components/Navbar"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import {
    LayoutDashboard,
    Heart,
    Calendar,
    MessageSquare,
    User,
    Loader2
} from "lucide-react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Heart, label: "Saved Properties", href: "/dashboard/saved" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: MessageSquare, label: "Inquiries", href: "/dashboard/inquiries" },
    { icon: User, label: "Profile Settings", href: "/dashboard/profile" },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const activeUser = session?.user ?? null
            
            if (!activeUser) {
                router.replace("/login")
            } else {
                setAuthorized(true)
                setLoading(false)
            }
        }
        checkAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setAuthorized(false)
                router.replace("/login")
            } else {
                setAuthorized(true)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 text-secondary animate-spin" />
            </div>
        )
    }

    if (!authorized) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-foreground">
            {/* Navbar is persistent at the top */}
            <Navbar forceScrolled />
            <BackgroundDecor />

            <div className="flex flex-col lg:flex-row flex-1 container mx-auto px-4 sm:px-2 lg:px-2 max-w-9xl pt-24 lg:pt-28 pb-8 gap-8">
                {/* Mobile/Tablet Sub-Navigation (hidden on desktop) */}
                <div className="lg:hidden w-full overflow-x-auto pb-3 mb-2 flex gap-2 border-b border-border/40 scrollbar-none select-none">
                    <div className="flex gap-2 min-w-max px-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                                <Link key={item.href} href={item.href}>
                                    <button
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 whitespace-nowrap",
                                            isActive
                                                ? "bg-secondary/15 text-secondary border border-secondary/20 shadow-sm"
                                                : "text-muted-foreground bg-white/40 hover:text-foreground border border-transparent"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        {item.label}
                                    </button>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Sidebar - hidden on mobile, visible on desktop */}
                <DashboardSidebar />

                {/* Main Content Area */}
                <main className="flex-1 w-full min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}

