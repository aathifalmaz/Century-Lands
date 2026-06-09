"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { signOut } from "@/lib/backend/auth"
import { toast } from "sonner"
import {
    LayoutDashboard,
    Heart,
    Calendar,
    MessageSquare,
    User,
    LogOut,
    Menu as MenuIcon,
    Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Heart, label: "Saved Properties", href: "/dashboard/saved" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: MessageSquare, label: "Inquiries", href: "/dashboard/inquiries" },
    { icon: User, label: "Profile Settings", href: "/dashboard/profile" },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success("Signed out successfully")
            router.refresh()
            router.push("/")
        } catch (error: any) {
            toast.error("Failed to sign out")
        }
    }

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const isAdmin = user?.user_metadata?.role?.toLowerCase() === "admin"

    return (
        <aside className="w-64 hidden lg:flex flex-col">
            <Card className="sticky top-28 h-[calc(100vh-9rem)] border-none shadow-xl bg-white/70 backdrop-blur-xl flex flex-col overflow-hidden">
                <CardHeader className="px-4 py-4 shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base text-primary">

                        Dashboard
                    </CardTitle>
                </CardHeader>

                <Separator className="bg-border/50" />

                <CardContent className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
                    {/* Main Menu */}
                    <div className="space-y-1">
                        <p className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                            Menu
                        </p>
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start gap-3 relative overflow-hidden mb-1",
                                            isActive
                                                ? "bg-secondary/10 text-secondary hover:bg-secondary/20 hover:text-secondary font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-gray-100/50"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r-full" />
                                        )}
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-secondary" : "")} />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Admin */}
                    {isAdmin && (
                        <div className="space-y-1">
                            <p className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                                Administration
                            </p>
                            <Link href="/admin">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold transition-all mb-1"
                                >
                                    <Shield className="h-4 w-4 text-emerald-600 animate-pulse" />
                                    Admin Portal
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Account */}
                    <div className="space-y-1">
                        <p className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                            Account
                        </p>
                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </CardContent>

                {/* Profile Stats Widget (Pinned to bottom) */}
                <div className="p-4 bg-secondary/5 mt-auto border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-secondary">Profile Completion</p>
                        <span className="text-[10px] font-bold text-secondary">85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[85%]" />
                    </div>
                </div>
            </Card>
        </aside>
    )
}
