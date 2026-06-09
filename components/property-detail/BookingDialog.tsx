"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CalendarDays, Clock, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { createAppointment } from "@/lib/backend/appointments"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useEffect } from "react"

interface BookingDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    propertyTitle: string
    propertyId: number
}

const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM",
]

export function BookingDialog({
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
    propertyTitle,
    propertyId,
}: BookingDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const onOpenChange = externalOnOpenChange || setInternalOpen

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState("")
    const [message, setMessage] = useState("")
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const checkUserAndPrefill = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setName(session.user.user_metadata?.full_name || "")
                setEmail(session.user.email || "")
                setPhone(session.user.user_metadata?.phone || "")
            }
        }
        if (open) {
            checkUserAndPrefill()
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date || !time) {
            toast.error("Please pick a date and time")
            return
        }

        setIsSubmitting(true)
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
                property_id: propertyId.toString(),
                property_title: propertyTitle,
                customer_name: name,
                email: email,
                appointment_date: format(date, "yyyy-MM-dd"),
                appointment_time: formattedTime,
                type: "Site Visit",
                notes: `Phone: ${phone}${message ? `\nMessage: ${message}` : ""}`,
            })

            toast.success("Appointment request sent successfully!")
            onOpenChange(false)
            setName(""); setPhone(""); setEmail("")
            setDate(undefined); setTime(""); setMessage("")
        } catch (error) {
            console.error('Booking error:', error)
            toast.error("Failed to book appointment. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-[95vw] bg-white rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Book Appointment</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Schedule a visit for <span className="font-semibold text-foreground">{propertyTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+94 7X XXX XXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-sm">Preferred Date</Label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        type="button"
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
                        <Label htmlFor="message" className="text-sm">Message (optional)</Label>
                        <Textarea
                            id="message"
                            placeholder="Any special requests or questions..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className="rounded-xl resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-secondary text-white rounded-full h-11 font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? "Submitting..." : "Confirm Booking"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
