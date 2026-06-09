"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Calendar, Clock, Phone, MoreHorizontal, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getAppointmentsByEmail, updateAppointmentStatus } from "@/lib/backend/appointments"
import { toast } from "sonner"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* Helper for status colors */
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "confirmed": return "bg-green-100 text-green-800 border-green-200"
        case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "completed": return "bg-gray-100 text-gray-800 border-gray-200"
        case "cancelled": return "bg-red-100 text-red-800 border-red-200"
        default: return "bg-gray-100 text-gray-800"
    }
}

export default function AppointmentsPage() {
    const [user, setUser] = useState<any>(null)
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUserAndAppointments = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const loggedInUser = session?.user ?? null
            setUser(loggedInUser)

            if (loggedInUser && loggedInUser.email) {
                const data = await getAppointmentsByEmail(loggedInUser.email)
                setAppointments(data)
            }
        } catch (error: any) {
            console.error("Error loading appointments:", error)
            toast.error("Failed to load appointments: " + (error.message || "Unknown error"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserAndAppointments()
    }, [])

    const handleCancel = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "Cancelled")
            setAppointments(prev =>
                prev.map(apt => (apt.id === id ? { ...apt, status: "Cancelled" } : apt))
            )
            toast.success("Appointment cancelled successfully.")
        } catch (error: any) {
            console.error("Cancel appointment error:", error)
            toast.error("Failed to cancel appointment: " + (error.message || "Unknown error"))
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        )
    }

    const upcoming = appointments.filter(a => ["Confirmed", "Pending"].includes(a.status || ""))
    const past = appointments.filter(a => !["Confirmed", "Pending"].includes(a.status || ""))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-third">Appointments</h1>
                <p className="text-muted-foreground mt-1">Manage your upcoming site visits and property tours.</p>
            </div>

            {/* Upcoming Appointments */}
            <Card className="border-border/60 shadow-sm bg-white rounded-2xl overflow-hidden">
                <CardHeader className="py-5 px-6 border-b border-border/40 bg-gray-50/50">
                    <CardTitle className="text-lg font-bold text-third flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-secondary" />
                        Upcoming Visits
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {upcoming.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Property</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Agent</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcoming.map((apt) => (
                                    <TableRow key={apt.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-medium py-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-primary">{apt.property_title}</span>
                                                <span className="text-xs text-muted-foreground capitalize">{apt.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> {apt.appointment_date}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                                                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {apt.appointment_time}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="font-medium text-slate-700">{apt.agent_name || "Assigned Agent"}</span>
                                                {apt.agent_phone && (
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {apt.agent_phone}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(apt.status || "Pending")}>
                                                {apt.status || "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleCancel(apt.id)}
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                                    >
                                                        Cancel Appointment
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground italic">No upcoming appointments.</div>
                    )}
                </CardContent>
            </Card>

            {/* Past Appointments */}
            <div className="pt-4">
                <Card className="border-border/60 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="py-5 px-6 border-b border-border/40 bg-gray-50/50">
                        <CardTitle className="text-lg font-bold text-third">Past & Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {past.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Property</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right pr-6">Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {past.map((apt) => (
                                        <TableRow key={apt.id} className="opacity-70 hover:opacity-100 hover:bg-slate-50 transition-all duration-300">
                                            <TableCell className="font-semibold text-primary py-4 pl-6">{apt.property_title}</TableCell>
                                            <TableCell className="font-medium text-slate-700">{apt.appointment_date}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getStatusColor(apt.status || "Completed")}>
                                                    {apt.status || "Completed"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 text-muted-foreground italic text-sm">
                                                {apt.notes || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground italic">No past appointments.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
