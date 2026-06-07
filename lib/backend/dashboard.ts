import { supabase, getSupabaseAdmin } from "@/lib/supabase"
import { getAccountStats } from "./sales"

export async function getAdminDashboardStats() {
    try {
        const adminClient = getSupabaseAdmin()

        // 1. Fetch all users for processing
        // Note: listUsers() returns up to 1000 users. Fine for this scale.
        const { data: { users }, error: userError } = await adminClient.auth.admin.listUsers()
        if (userError) throw userError

        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const lastHour = new Date(now.getTime() - 60 * 60 * 1000)
        const onlineThreshold = new Date(now.getTime() - 15 * 60 * 1000)

        // User Stats
        const totalUsers = users.length
        const newUsers = users.filter(u => new Date(u.created_at) > lastMonth).length
        const activeNow = users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > onlineThreshold).length
        const sinceLastHour = users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > lastHour).length

        // Total Users Growht (Previous month's users vs current)
        const prevMonthUsers = users.filter(u => new Date(u.created_at) <= lastMonth).length
        const userGrowthPercent = prevMonthUsers === 0 ? 100 : Math.round(((totalUsers - prevMonthUsers) / prevMonthUsers) * 100)

        // 2. Property Stats
        // Currently Sold
        const { data: properties, error: propError } = await supabase
            .from('properties')
            .select('status, created_at')

        if (propError) throw propError

        const soldCount = properties.filter(p => p.status === 'Sold').length

        // Sold this month vs last month (approx via created_at if we don't have sold_at)
        // Ideally we'd have a 'sold_at' field in properties or use sales_records.
        const soldThisMonth = properties.filter(p => p.status === 'Sold' && new Date(p.created_at) > lastMonth).length
        const prevMonthSold = properties.filter(p => p.status === 'Sold' && new Date(p.created_at) <= lastMonth).length
        const soldGrowthPercent = prevMonthSold === 0 ? (soldThisMonth > 0 ? 100 : 0) : Math.round(((soldThisMonth) / prevMonthSold) * 100)

        // 3. Recent Activity 
        // Fetch latest developments from multiple tables
        const [{ data: latestProps }, { data: latestInquiries }, { data: latestAppts }] = await Promise.all([
            supabase.from('properties').select('title, created_at').order('created_at', { ascending: false }).limit(3),
            supabase.from('inquiries').select('name, created_at').order('created_at', { ascending: false }).limit(3),
            supabase.from('appointments').select('customer_name, property_title, created_at').order('created_at', { ascending: false }).limit(3)
        ])

        const activityLog: any[] = []

        latestProps?.forEach(p => activityLog.push({
            type: 'property',
            message: `New Property: ${p.title}`,
            time: p.created_at
        }))

        latestInquiries?.forEach(i => activityLog.push({
            type: 'inquiry',
            message: `New Inquiry from ${i.name}`,
            time: i.created_at
        }))

        latestAppts?.forEach(a => activityLog.push({
            type: 'appointment',
            message: `Appointment for ${a.property_title}`,
            time: a.created_at
        }))

        // Sort by time descending and take top 5
        const recentActivity = activityLog
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 5)

        // 4. Revenue & Chart Data
        const { data: salesRecords, error: salesError } = await supabase
            .from('sales_records')
            .select('commission_amount, sale_date')
            .order('sale_date', { ascending: true })

        if (salesError) throw salesError

        // Group by month for chart (last 6 months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const revenueChart: any[] = []

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            revenueChart.push({
                name: monthNames[d.getMonth()],
                revenue: 0,
                monthKey: `${d.getFullYear()}-${d.getMonth()}`
            })
        }

        salesRecords?.forEach(record => {
            const date = new Date(record.sale_date)
            const key = `${date.getFullYear()}-${date.getMonth()}`
            const chartItem = revenueChart.find(item => item.monthKey === key)
            if (chartItem) {
                chartItem.revenue += Number(record.commission_amount || 0)
            }
        })

        const totalRevenue = salesRecords?.reduce((sum, s) => sum + Number(s.commission_amount || 0), 0) || 0

        // 5. User Growth Chart (last 6 months)
        const userChart: any[] = []
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            userChart.push({
                name: monthNames[d.getMonth()],
                users: 0,
                monthKey: `${d.getFullYear()}-${d.getMonth()}`
            })
        }

        users.forEach(u => {
            const date = new Date(u.created_at)
            const key = `${date.getFullYear()}-${date.getMonth()}`
            const chartItem = userChart.find(item => item.monthKey === key)
            if (chartItem) {
                chartItem.users += 1
            }
        })

        // 6. Weekly Views (last 7 days)
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
        const { data: views, error: viewsError } = await supabase
            .from('property_views')
            .select('viewed_at')
            .gte('viewed_at', sevenDaysAgo.toISOString())

        if (viewsError) throw viewsError

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const viewsChart: any[] = []

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
            viewsChart.push({
                name: dayNames[d.getDay()],
                views: 0,
                dateKey: d.toISOString().split('T')[0]
            })
        }

        views?.forEach(v => {
            const dateStr = v.viewed_at.split('T')[0]
            const chartItem = viewsChart.find(item => item.dateKey === dateStr)
            if (chartItem) {
                chartItem.views += 1
            }
        })

        return {
            users: {
                total: totalUsers,
                new: newUsers,
                active: activeNow,
                sinceLastHour: sinceLastHour,
                growthPercent: userGrowthPercent,
                chartData: userChart.map(({ name, users }) => ({ name, users }))
            },
            properties: {
                sold: soldCount,
                growthPercent: soldGrowthPercent
            },
            revenue: {
                total: totalRevenue,
                chartData: revenueChart.map(({ name, revenue }) => ({ name, revenue }))
            },
            views: {
                chartData: viewsChart.map(({ name, views }) => ({ name, views }))
            },
            recentActivity
        }
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error)
        return null
    }
}
