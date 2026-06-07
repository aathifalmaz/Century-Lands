"use strict";
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Building2,
    Calendar,
    MessageSquare,
    Users,
    BarChart3,
    Settings,
    FileText,
    LogOut,
    Shield,
    Mail,
    Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/UserNav"

const adminRoutes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        color: "text-sky-500",
    },
    {
        label: "Properties",
        icon: Building2,
        href: "/admin/properties",
        color: "text-violet-500",
    },
    {
        label: "Appointments",
        icon: Calendar,
        href: "/admin/appointments",
        color: "text-pink-700",
    },
    /*{
        label: "Inquiries",
        icon: MessageSquare,
        href: "/admin/inquiries",
        color: "text-orange-700",
    },*/
    {
        label: "Leads CRM",
        icon: FileText,
        href: "/admin/leads",
        color: "text-emerald-500",
    },
    {
        label: "Users",
        icon: Users,
        href: "/admin/users",
        color: "text-orange-700",
    },
    {
        label: "Accounts",
        icon: BarChart3,
        href: "/admin/accounts",
        color: "text-amber-500",
    },
    // Analytics removed as it is now part of the dashboard
    {
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
    },
]

import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

export function AdminSidebar() {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-third/30 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin" className="flex items-center pl-3 mb-4">
                    <Shield className="h-8 w-8 mr-4 text-emerald-500" />
                    <h1 className="text-xl font-bold">
                        Admin Portal
                    </h1>
                </Link>
                <div className="space-y-1">
                    {adminRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-12 p-4 border border-dashed border-emerald-600/50 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                            <span className="text-sm font-bold text-white">N</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white">Nexora Software Solutions</h4>

                        </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                        Need help or updates? Contact the development team.
                    </p>
                    <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">
                            <Phone className="h-3 w-3" />
                            <span>+94 77 123 4567</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">
                            <Mail className="h-3 w-3" />
                            <span>support@nexora.lk</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-3 py-2 border-t border-slate-800">
                <div className="mb-4">
                    <UserNav user={user} align="start" side="top" displayUserDetails={true} />
                </div>
                <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10">
                        <LogOut className="h-5 w-5 mr-3" />
                        Exit to App
                    </Button>
                </Link>
            </div>
        </div>
    )
}
