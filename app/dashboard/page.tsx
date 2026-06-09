"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Heart, MessageSquare, Eye, Shield, Loader2 } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function DashboardOverview() {
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState({
        savedCount: 0,
        appointmentsCount: 0,
        inquiriesCount: 0
    })
    const [appointments, setAppointments] = useState<any[]>([])
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                try {
                    setLoading(true)

                    // 1. Fetch saved properties count
                    const { data: savedProps, count: savedCount } = await supabase
                        .from('saved_properties')
                        .select('*, properties(title)', { count: 'exact' })
                        .eq('user_id', currentUser.id)

                    // 2. Fetch appointments
                    const { data: appts } = await supabase
                        .from('appointments')
                        .select('*')
                        .eq('email', currentUser.email)
                        .order('appointment_date', { ascending: true })

                    // 3. Fetch inquiries
                    const { data: inqs } = await supabase
                        .from('inquiries')
                        .select('*')
                        .eq('email', currentUser.email)
                        .order('created_at', { ascending: false })

                    setStats({
                        savedCount: savedCount || 0,
                        appointmentsCount: appts?.length || 0,
                        inquiriesCount: inqs?.length || 0
                    })

                    if (appts) {
                        setAppointments(appts.slice(0, 3)) // Limit to top 3 upcoming
                    }

                    // 4. Construct recent activities dynamically from real actions
                    const activityList: any[] = []

                    if (savedProps) {
                        savedProps.forEach((item: any) => {
                            activityList.push({
                                id: `saved-${item.id}`,
                                type: 'saved',
                                message: `You saved '${item.properties?.title || 'a property'}'`,
                                date: new Date(item.created_at),
                            })
                        })
                    }

                    if (appts) {
                        appts.forEach((item: any) => {
                            activityList.push({
                                id: `appt-${item.id}`,
                                type: 'appointment',
                                message: `Appointment booked: '${item.property_title || 'a property'}' (${item.status || 'Pending'})`,
                                date: new Date(item.created_at),
                            })
                        })
                    }

                    if (inqs) {
                        inqs.forEach((item: any) => {
                            activityList.push({
                                id: `inq-${item.id}`,
                                type: 'inquiry',
                                message: item.reply 
                                    ? `Agent replied to inquiry on '${item.property_title || 'property'}'` 
                                    : `You sent an inquiry about '${item.property_title || 'a property'}'`,
                                date: new Date(item.created_at),
                            })
                        })
                    }

                    // Sort activity list by date descending
                    activityList.sort((a, b) => b.date.getTime() - a.date.getTime())

                    // Format dates human-readably
                    const formattedActivities = activityList.slice(0, 5).map(act => {
                        const diffMs = new Date().getTime() - act.date.getTime()
                        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
                        const diffDays = Math.floor(diffHrs / 24)
                        
                        let dateStr = ''
                        if (diffHrs < 1) {
                            dateStr = 'Just now'
                        } else if (diffHrs < 24) {
                            dateStr = `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`
                        } else if (diffDays < 7) {
                            dateStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
                        } else {
                            dateStr = act.date.toLocaleDateString()
                        }

                        return {
                            id: act.id,
                            type: act.type,
                            message: act.message,
                            date: dateStr
                        }
                    })

                    setActivities(formattedActivities)

                } catch (err: any) {
                    console.error("Error loading dashboard data:", err)
                    toast.error("Failed to load dashboard data: " + (err.message || "Unknown error"))
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        fetchDashboardData()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchDashboardData()
            } else {
                setUser(null)
                setStats({ savedCount: 0, appointmentsCount: 0, inquiriesCount: 0 })
                setAppointments([])
                setActivities([])
                setLoading(false)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const isAdmin = user?.user_metadata?.role?.toLowerCase() === "admin"

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        )
    }

    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
    const userInitials = userName.charAt(0).toUpperCase()

    const statsCards = [
        { label: "Saved Properties", value: stats.savedCount, icon: Heart, href: "/dashboard/saved" },
        { label: "Upcoming Appointments", value: stats.appointmentsCount, icon: Calendar, href: "/dashboard/appointments" },
        { label: "Inquiries Sent", value: stats.inquiriesCount, icon: MessageSquare, href: "/dashboard/inquiries" }
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="rounded-full p-[3px] bg-[conic-gradient(from_0deg,hsl(var(--primary)),hsl(var(--secondary)),hsl(var(--accent)),hsl(var(--primary)))]">
                        <Avatar className="h-16 w-16 border-2 border-white">
                            <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={userName} />
                            <AvatarFallback className="bg-primary text-white font-bold">{userInitials}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-third">Hello, {userName.split(" ")[0]}!</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Here&apos;s a summary of your activity with Century Lands.</p>
                    </div>
                </div>
                
                {isAdmin && (
                    <Link href="/admin" className="shrink-0">
                        <Button className="w-full sm:w-auto h-11 px-6 font-bold bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group">
                            <Shield className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300 text-emerald-100" />
                            <span>Access Admin Panel</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statsCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Link key={stat.label} href={stat.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-secondary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Appointments */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-third">Upcoming Appointments</h2>
                        <Link href="/dashboard/appointments" className="text-sm text-secondary hover:underline font-medium">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <Card key={apt.id} className="border-border/60">
                                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="h-6 w-6 text-secondary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary">{apt.property_title || "Untitled Property"}</h3>
                                                <p className="text-sm text-muted-foreground">with {apt.agent_name || "Assigned Agent"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className="text-sm font-medium text-primary">
                                                {apt.appointment_date} • {apt.appointment_time}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                apt.status === "Confirmed" 
                                                    ? "bg-green-100 text-green-800" 
                                                    : apt.status === "Cancelled"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {apt.status || "Pending"}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">No upcoming appointments.</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-third">Recent Activity</h2>
                    <Card className="border-border/60">
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/60">
                                {activities.length > 0 ? (
                                    activities.map((activity) => (
                                        <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <p className="text-sm text-gray-800 font-medium mb-1">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-sm text-muted-foreground">
                                        No recent activity.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
