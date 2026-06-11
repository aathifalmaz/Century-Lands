"use client"

import { BackgroundDecor } from "@/components/BackgroundDecor"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, DollarSign, Users, Activity, CreditCard, Mail } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid, Area, AreaChart } from "recharts"
import { useEffect, useState } from "react"
import { fetchDashboardStats } from "@/lib/actions/dashboard"

function formatTimeAgo(dateString: string) {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMs = now.getTime() - past.getTime()

    const diffInMins = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMins < 1) return 'Just now'
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${diffInDays}d ago`
}

export default function AdminDashboardPage() {
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalRevenue: 0,
        soldCount: 0,
        totalUsers: 0,
        newUsers: 0,
        activeNow: 0,
        sinceLastHour: 0,
        userGrowth: 0,
        soldGrowth: 0,
        recentActivity: [] as any[],
        revenueChart: [] as any[],
        userGrowthChart: [] as any[],
        viewsChart: [] as any[]
    })

    useEffect(() => {
        setMounted(true)
        async function loadStats() {
            try {
                setLoading(true)
                const data = await fetchDashboardStats()
                if (data) {
                    setStats({
                        totalRevenue: data.revenue.total,
                        soldCount: data.properties.sold,
                        totalUsers: data.users.total,
                        newUsers: data.users.new,
                        activeNow: data.users.active,
                        sinceLastHour: data.users.sinceLastHour,
                        userGrowth: data.users.growthPercent,
                        soldGrowth: data.properties.growthPercent,
                        recentActivity: data.recentActivity || [],
                        revenueChart: data.revenue.chartData || [],
                        userGrowthChart: data.users.chartData || [],
                        viewsChart: data.views?.chartData || []
                    })
                }
            } catch (error) {
                console.error('Error loading dashboard stats:', error)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    return (
        <div className="p-4 pt-1 sm:pt-4 space-y-4 relative min-h-screen pb-10">
            <BackgroundDecor />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Admin Dashboard Overview</h2>
                {loading && (
                    <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                        <Activity className="h-4 w-4" />
                        <span className="text-sm">Updating...</span>
                    </div>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 bg-slate-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">LKR {stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From {stats.soldCount} properties</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 bg-slate-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className={stats.userGrowth >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                                {stats.userGrowth >= 0 ? "+" : ""}{stats.userGrowth}%
                            </span> growth
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-violet-500 hover:shadow-lg transition-all duration-300 bg-slate-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Properties Sold</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-violet-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.soldCount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className={stats.soldGrowth >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                                {stats.soldGrowth >= 0 ? "+" : ""}{stats.soldGrowth}%
                            </span> growth
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 bg-slate-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.activeNow.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-emerald-600 font-medium">+{stats.sinceLastHour}</span> last hour
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">

                {/* Revenue Chart */}
                <Card className="bg-slate-50 overflow-hidden">
                    <CardHeader>
                        <CardTitle>Commission Revenue</CardTitle>
                        <CardDescription>Monthly earned from sales (Last 6m)</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pb-4 h-[300px] flex items-center justify-center">
                        {mounted ? (
                            stats.revenueChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.revenueChart} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `LKR ${v}`} />
                                        <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(v: any) => [`LKR ${v.toLocaleString()}`, "Commission"]} />
                                        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground text-sm italic">No revenue data found</div>
                            )
                        ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        )}
                    </CardContent>
                </Card>

                {/* User Growth */}
                <Card className="bg-slate-50 overflow-hidden">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>Monthly registrations trend</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pb-4 h-[300px] flex items-center justify-center">
                        {mounted ? (
                            stats.userGrowthChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.userGrowthChart} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="New Users" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground text-sm italic">No user growth data</div>
                            )
                        ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        )}
                    </CardContent>
                </Card>

                {/* Property Views */}
                <Card className="bg-slate-50 overflow-hidden">
                    <CardHeader>
                        <CardTitle>Weekly Engagement</CardTitle>
                        <CardDescription>Daily total property views</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pb-4 h-[300px] flex items-center justify-center">
                        {mounted ? (
                            stats.viewsChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.viewsChart} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Views" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground text-sm italic">No view records found</div>
                            )
                        ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-slate-50 overflow-hidden">
                    <CardHeader>
                        <CardTitle>Activity Feed</CardTitle>
                        <CardDescription>Latest system updates</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] overflow-y-auto px-6">
                        <div className="space-y-6 py-2">
                            {stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((activity, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">
                                            {activity.type === 'property' && <Building2 className="h-4 w-4 text-emerald-500" />}
                                            {activity.type === 'inquiry' && <Mail className="h-4 w-4 text-blue-500" />}
                                            {activity.type === 'appointment' && <Activity className="h-4 w-4 text-orange-500" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-semibold text-slate-900">{activity.message}</p>
                                            <p className="text-xs text-slate-500">{formatTimeAgo(activity.time)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-10 italic">No recent activity</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
