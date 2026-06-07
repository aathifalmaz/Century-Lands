"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle, XCircle, Send, CalendarDays, Clock } from "lucide-react"
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAppointments, createAppointment, updateAppointmentStatus, type Appointment } from "@/lib/backend/appointments"
import { getProperties } from "@/lib/backend/properties"
import { toast } from "sonner"

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("All")
    const [filterStatus, setFilterStatus] = useState("All")
    const [loading, setLoading] = useState(true)

    // Form State for new booking
    const [newBooking, setNewBooking] = useState({
        customerName: "",
        email: "",
        propertyId: "",
        propertyTitle: "",
        type: "Site Visit",
        notes: ""
    })
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState("")
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [properties, setProperties] = useState<any[]>([])

    useEffect(() => {
        fetchAppointments()
        fetchProperties()
    }, [])

    async function fetchAppointments() {
        setLoading(true)
        try {
            const data = await getAppointments()
            setAppointments(data)
        } catch (error) {
            toast.error("Failed to fetch appointments")
        }
        setLoading(false)
    }

    async function fetchProperties() {
        try {
            const data = await getProperties()
            setProperties(data)
        } catch (error) {
            console.error('Error fetching properties:', error)
        }
    }

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch =
            apt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.property_title.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filterType === "All" || apt.type === filterType
        const matchesStatus = filterStatus === "All" || apt.status === filterStatus

        return matchesSearch && matchesType && matchesStatus
    })

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateAppointmentStatus(id, newStatus)
            toast.success(`Appointment ${newStatus}`)
            fetchAppointments()
        } catch (error) {
            toast.error("Update failed")
        }
    }

    const handleCreateBooking = async () => {
        if (!newBooking.customerName || !newBooking.email || !date || !time) {
            toast.error("Please fill in all required fields")
            return
        }

        const selectedProp = properties.find(p => p.id.toString() === newBooking.propertyId)

        try {
            // Format 24-hour time (e.g., "14:30") to standard 12-hour format with AM/PM (e.g., "02:30 PM")
            let formattedTime = time
            if (time && time.includes(":")) {
                const parts = time.split(" ")
                if (parts.length === 1) { // Only convert if it's currently a 24-hour format
                    const [hrs, mins] = time.split(":")
                    const hours = parseInt(hrs, 10)
                    const ampm = hours >= 12 ? "PM" : "AM"
                    const hours12 = hours % 12 || 12
                    const paddedHours = hours12.toString().padStart(2, "0")
                    formattedTime = `${paddedHours}:${mins} ${ampm}`
                }
            }

            await createAppointment({
                customer_name: newBooking.customerName,
                email: newBooking.email,
                property_id: newBooking.propertyId,
                property_title: selectedProp?.title || "Manual Booking",
                appointment_date: format(date, "yyyy-MM-dd"),
                appointment_time: formattedTime,
                type: newBooking.type,
                notes: newBooking.notes,
                status: "Confirmed"
            })

            toast.success("Appointment booked successfully")
            fetchAppointments()
            // Reset form
            setNewBooking({ customerName: "", email: "", propertyId: "", propertyTitle: "", type: "Site Visit", notes: "" })
            setDate(undefined)
            setTime("")
        } catch (error) {
            toast.error("Booking failed")
        }
    }

    const timeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
    ]

    return (
        <div className="p-4 space-y-4">
            <BackgroundDecor />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Appointments</h2>
                    <p className="text-muted-foreground">Manage property viewings and meetings.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="hover:bg-secondary">Book Appointment</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md w-[95vw] bg-white rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Book Appointment</DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    Schedule a new property viewing or meeting.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm">Customer Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Full Name"
                                        className="rounded-xl"
                                        value={newBooking.customerName}
                                        onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        className="rounded-xl"
                                        value={newBooking.email}
                                        onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="property" className="text-sm">Property</Label>
                                    <Select
                                        value={newBooking.propertyId}
                                        onValueChange={(val) => setNewBooking({ ...newBooking, propertyId: val })}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select Property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {properties.map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Date</Label>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal rounded-xl h-9 gap-2",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarDays className="h-4 w-4 shrink-0" />
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(d) => { setDate(d); setCalendarOpen(false) }}
                                                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="time" className="text-sm">Select Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                                            <Input
                                                id="time"
                                                type="time"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                required
                                                className="pl-9 rounded-xl h-9 bg-white cursor-pointer w-full text-foreground hover:border-gray-300 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-sm">Appointment Type</Label>
                                    <Select
                                        value={newBooking.type}
                                        onValueChange={(val) => setNewBooking({ ...newBooking, type: val })}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Site Visit">Site Visit</SelectItem>
                                            <SelectItem value="Virtual Tour">Virtual Tour</SelectItem>
                                            <SelectItem value="Meeting">Meeting</SelectItem>
                                            <SelectItem value="Closing">Closing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any special requests..."
                                        className="rounded-xl resize-none"
                                        rows={2}
                                        value={newBooking.notes}
                                        onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button
                                    onClick={handleCreateBooking}
                                    className="w-full bg-primary hover:bg-secondary text-white rounded-full h-11 font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    Confirm Booking
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4 w-full">
                <div className="relative flex-1 bg-white rounded-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search appointments..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Appointment Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Site Visit">Site Visit</SelectItem>
                        <SelectItem value="Virtual Tour">Virtual Tour</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Closing">Closing</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        <TableRow>
                            <TableHead className="pl-10 h-12">Customer</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-10">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Loading...</TableCell>
                            </TableRow>
                        ) : filteredAppointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No appointments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAppointments.map((apt) => (
                                <TableRow key={apt.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium pl-10 py-4">
                                        <div className="text-primary">{apt.customer_name}</div>
                                        <div className="text-xs text-muted-foreground">{apt.email}</div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate font-medium" title={apt.property_title}>
                                        {apt.property_title}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{apt.appointment_date}</div>
                                        <div className="text-xs text-muted-foreground">{apt.appointment_time}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                                            {apt.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            apt.status === "Confirmed" ? "default" :
                                                apt.status === "Pending" ? "secondary" :
                                                    apt.status === "Completed" ? "outline" : "destructive"
                                        }>
                                            {apt.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-10">
                                        <div className="flex justify-end gap-2">
                                            {apt.status === "Pending" && (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                                                        onClick={() => handleStatusChange(apt.id, "Confirmed")}
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                                                        onClick={() => handleStatusChange(apt.id, "Cancelled")}
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </Button>
                                                </>
                                            )}
                                            {apt.status === "Confirmed" && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-primary hover:bg-primary/5 rounded-full"
                                                    onClick={() => handleStatusChange(apt.id, "Completed")}
                                                >
                                                    Mark Done
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
