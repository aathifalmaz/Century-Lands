"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Heart, Phone, MessageCircle, Share2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { saveProperty, unsaveProperty, isPropertySaved } from "@/lib/backend/savedProperties"
import { toast } from "sonner"
import { BookingDialog } from "@/components/property-detail/BookingDialog"

interface PropertyActionsProps {
    propertyId: string | number
    propertyTitle: string
    phone: string
    whatsapp: string
}

export function PropertyActions({ propertyId, propertyTitle, phone, whatsapp }: PropertyActionsProps) {
    const [user, setUser] = useState<any>(null)
    const [isFavorited, setIsFavorited] = useState(false)
    const [loadingFavorite, setLoadingFavorite] = useState(false)
    const [bookingOpen, setBookingOpen] = useState(false)

    useEffect(() => {
        const checkUserAndFavorite = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const loggedInUser = session?.user ?? null
            setUser(loggedInUser)

            if (loggedInUser && propertyId) {
                try {
                    const saved = await isPropertySaved(loggedInUser.id, parseInt(propertyId.toString()))
                    setIsFavorited(saved)
                } catch (error) {
                    console.error("Error checking favorite status:", error)
                }
            }
        }
        checkUserAndFavorite()
    }, [propertyId])

    const handleFavoriteToggle = async () => {
        if (!user) {
            toast.error("Please login to save this property.")
            return
        }

        const numericId = parseInt(propertyId.toString())
        if (isNaN(numericId)) {
            toast.error("Invalid property identification.")
            return
        }

        setLoadingFavorite(true)
        try {
            if (isFavorited) {
                await unsaveProperty(user.id, numericId)
                setIsFavorited(false)
                toast.success("Removed from saved list!")
            } else {
                await saveProperty(user.id, numericId)
                setIsFavorited(true)
                toast.success("Property saved successfully!")
            }
        } catch (error) {
            toast.error("Failed to update saved property.")
        } finally {
            setLoadingFavorite(false)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: document.title,
                url: window.location.href,
            })
        } else {
            await navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied to clipboard!")
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Primary CTA */}
            <Button
                onClick={() => setBookingOpen(true)}
                className="w-full bg-primary hover:bg-secondary text-white rounded-full px-6 h-11 text-sm font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2"
            >
                <Calendar className="h-4 w-4" />
                Book Appointment
            </Button>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full">
                {/* Favorites */}
                <Button
                    variant="outline"
                    onClick={handleFavoriteToggle}
                    disabled={loadingFavorite}
                    className="w-full rounded-full h-11 px-4 gap-2 border-border/60 hover:border-destructive hover:text-destructive transition-all"
                >
                    {loadingFavorite ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                        <Heart className={`h-4 w-4 transition-colors ${isFavorited ? "fill-destructive text-destructive" : ""}`} />
                    )}
                    {isFavorited ? "Saved" : "Save"}
                </Button>

                {/* Call Agent */}
                <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-full h-11 px-4 gap-2 border-border/60 hover:border-secondary hover:text-secondary transition-all justify-center"
                >
                    <a href={`tel:${phone}`}>
                        <Phone className="h-4 w-4" />
                        Call
                    </a>
                </Button>

                {/* WhatsApp */}
                <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-full h-11 px-4 gap-2 border-border/60 hover:border-green-600 hover:text-green-600 transition-all justify-center"
                >
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                    </a>
                </Button>

                {/* Share */}
                <Button
                    variant="outline"
                    onClick={handleShare}
                    className="w-full rounded-full h-11 px-4 gap-2 border-border/60 hover:border-primary hover:text-primary transition-all"
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </div>

            {/* Mount Booking Dialog */}
            <BookingDialog
                open={bookingOpen}
                onOpenChange={setBookingOpen}
                propertyTitle={propertyTitle}
                propertyId={parseInt(propertyId.toString())}
            />
        </div>
    )
}
