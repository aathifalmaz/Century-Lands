"use server"

import { getAdminDashboardStats } from "@/lib/backend/dashboard"

export async function fetchDashboardStats() {
    return await getAdminDashboardStats()
}
