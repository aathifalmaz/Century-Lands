"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { checkEmailAndSendResetLink } from "@/lib/actions/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

/* ─── testimonials data ─── */
const testimonials = [
    {
        quote: "Century Lands helped us find our dream home in Colombo. Their professionalism and attention to detail made the entire process seamless.",
        name: "Kasun Perera",
        title: "Homeowner",
        subtitle: "Colombo 07",
    },
    {
        quote: "From plot selection to documentation, the team guided us through every step. We couldn't have asked for a better experience.",
        name: "Nishadi Fernando",
        title: "Property Investor",
        subtitle: "Negombo",
    },
    {
        quote: "Their market knowledge is unparalleled. We secured a prime commercial property well within our budget thanks to their expert negotiation.",
        name: "Ravi Jayawardena",
        title: "Business Owner",
        subtitle: "Kandy",
    },
]

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    /* ── testimonial state ── */
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    const handleResetPasswordRequest = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email address.")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.")
            return
        }

        console.log("🚀 Password reset request started for:", email)
        setLoading(true)

        try {
            const result = await checkEmailAndSendResetLink(email, window.location.origin)
            if (result.success) {
                setSubmitted(true)
                if (result.sandboxNotice) {
                    toast.warning(result.sandboxNotice, { duration: 15000 })
                } else {
                    toast.success("Password reset request sent!")
                }
            } else {
                if (result.error === "invalid email") {
                    toast.error("Invalid email. This account does not exist in our database.")
                } else {
                    toast.error(result.error || "Failed to send reset link.")
                }
            }
        } catch (error: any) {
            console.error("❌ Forgot password error:", error)
            toast.error(error.message || "Failed to process request.")
        } finally {
            setLoading(false)
        }
    }

    const nextTestimonial = () =>
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    const prevTestimonial = () =>
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    const current = testimonials[activeTestimonial]

    const imagePanel = (
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
            <NextImage src="/mock/12.jpg" alt="Premium property showcase" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-[#0B2545]/30 to-transparent" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#F5C518] via-[#C5A028]/60 to-transparent" />

            {/* Testimonial overlay */}
            <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 right-0 p-10 xl:p-14"
            >
                <p className="text-white/95 text-xl xl:text-2xl font-semibold leading-relaxed italic mb-6">
                    &ldquo;{current.quote}&rdquo;
                </p>
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-white font-bold text-base">{current.name}</p>
                        <p className="text-[#F5C518] font-medium text-sm">{current.title}</p>
                        <p className="text-white/60 text-sm">{current.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={prevTestimonial} className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-[#F5C518] hover:bg-white/5 transition-all duration-300" aria-label="Previous testimonial">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={nextTestimonial} className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-[#F5C518] hover:bg-white/5 transition-all duration-300" aria-label="Next testimonial">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 mt-5">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTestimonial(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-8 bg-[#F5C518]" : "w-3 bg-white/30 hover:bg-white/50"}`}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="forgot-password-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="min-h-screen flex flex-col lg:flex-row relative"
            >
                <BackgroundDecor />
                
                <div className="w-full lg:w-1/2 flex flex-col justify-between items-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24 py-10 bg-white/80 backdrop-blur-xl relative">
                    <div className="absolute top-8 left-8">
                        <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors group">
                            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            Back to Login
                        </Link>
                    </div>

                    <motion.div
                        key="forgot-password-form-inner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-sm mx-auto mt-28"
                    >
                        {!submitted ? (
                            <>
                                <h1 className="text-3xl font-bold text-primary mb-2">Forgot Password</h1>
                                <p className="text-muted-foreground text-sm mb-8">Enter your registered email below and we will check our system to send you a password reset link.</p>

                                <form onSubmit={handleResetPasswordRequest} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="reset-email" className="text-sm font-medium text-foreground">Email Address</Label>
                                        <Input 
                                            id="reset-email" 
                                            type="email" 
                                            placeholder="you@example.com" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            className="h-11 rounded-lg border-border/70 bg-white focus:border-primary focus:ring-primary/20" 
                                            required 
                                        />
                                    </div>

                                    <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-bold rounded-lg bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Reset Password
                                        </span>
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-green-50/50 border border-green-200/50 rounded-2xl p-6 shadow-sm backdrop-blur-sm"
                            >
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-green-950 mb-2">Check Your Inbox</h2>
                                <p className="text-sm text-green-800 leading-relaxed font-medium">
                                    Email has been send to the address to change the password
                                </p>
                                <div className="mt-6">
                                    <Link href="/login">
                                        <Button className="h-10 text-sm font-bold rounded-lg bg-[#0B2545] text-white">
                                            Return to Login
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <p className="text-xs text-muted-foreground mt-16 lg:mt-0">&copy; Century Lands &amp; Homes {new Date().getFullYear()}</p>
                </div>
                
                {imagePanel}
            </motion.div>
        </AnimatePresence>
    )
}
