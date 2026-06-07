"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDashboard } from "@/data/mockDashboard"
import { mockUser } from "@/data/mockUser"
import { Calendar, Heart, MessageSquare, Eye, Shield } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

/* Map icon strings to components */
const iconMap: Record<string, any> = {
    Heart,
    Calendar,
    MessageSquare,
    Eye,
}

export default function DashboardOverview() {
    const [user, setUser] = useState<any>(null)

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
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Avatar with Tri-color Ring (Navy, Green, Gold) */}
                    <div className="rounded-full p-[3px] bg-[conic-gradient(from_0deg,hsl(var(--primary)),hsl(var(--secondary)),hsl(var(--accent)),hsl(var(--primary)))]">
                        <Avatar className="h-16 w-16 border-2 border-white">
                            <AvatarImage src={user?.user_metadata?.avatar_url || mockUser.avatar} alt={user?.user_metadata?.full_name || mockUser.name} />
                            <AvatarFallback>{(user?.user_metadata?.full_name || mockUser.name).charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-third">Hello, {(user?.user_metadata?.full_name || mockUser.name).split(" ")[0]}!</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Here&apos;s a summary of your activity with Century Lands.</p>
                    </div>
                </div>
                
                {/* Admin button for fast access */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockDashboard.stats.map((stat) => {
                    const Icon = iconMap[stat.icon] || Eye
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
                        {mockDashboard.upcomingAppointments.length > 0 ? (
                            mockDashboard.upcomingAppointments.map((apt) => (
                                <Card key={apt.id} className="border-border/60">
                                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="h-6 w-6 text-secondary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary">{apt.property}</h3>
                                                <p className="text-sm text-muted-foreground">with {apt.agent}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className="text-sm font-medium text-primary">{apt.date} • {apt.time}</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {apt.status}
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
                                {mockDashboard.recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <p className="text-sm text-gray-800 font-medium mb-1">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
