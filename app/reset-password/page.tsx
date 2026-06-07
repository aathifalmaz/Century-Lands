"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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

export default function ResetPasswordPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    /**
     * sessionReady tracks whether Supabase has established a recovery session
     * from the magic link token in the URL hash. Until this is true, we show
     * a loading indicator and block form submission.
     *
     * When a user clicks the reset-password email link, Supabase embeds a
     * recovery token in the URL fragment (#access_token=...&type=recovery).
     * onAuthStateChange fires with event="PASSWORD_RECOVERY" once that token
     * is exchanged for a live session — only then can updateUser() succeed.
     */
    const [sessionReady, setSessionReady] = useState(false)
    const [sessionError, setSessionError] = useState(false)

    /* ── form state ── */
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    /* ── testimonial state ── */
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    /**
     * `settled` ref tracks whether a session has been established.
     * Using a ref (not state) avoids the stale-closure bug that occurs
     * when reading state inside a setTimeout callback captured at mount.
     */
    const settled = useRef(false)

    // ── Wait for Supabase to process the recovery token from the email link ──
    useEffect(() => {
        // Check if a session already exists (e.g. user refreshes page after token was exchanged)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && !settled.current) {
                settled.current = true
                setSessionReady(true)
            }
        })

        // onAuthStateChange handles both:
        //   PASSWORD_RECOVERY — implicit flow (older Supabase projects)
        //   SIGNED_IN        — PKCE flow (default in @supabase/ssr)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
                settled.current = true
                setSessionReady(true)
                setSessionError(false)
            } else if (event === "SIGNED_OUT") {
                settled.current = false
                setSessionReady(false)
            }
        })

        // Fallback: if no session is established within 8 s, show the expired-link error.
        // We read `settled.current` (a ref) — no stale-closure problem.
        const timeout = setTimeout(() => {
            if (!settled.current) {
                setSessionError(true)
            }
        }, 8000)

        return () => {
            subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [])

    // Password strength rules
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }

    const allChecksPassed = Object.values(passwordChecks).every(Boolean)

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!sessionReady) {
            toast.error("Your reset session is not ready. Please use the link from your email.")
            return
        }

        if (!allChecksPassed) {
            toast.error("Password does not meet all safety requirements.")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.")
            return
        }

        console.log("🚀 Starting password update attempt...")
        setLoading(true)

        try {
            // Update the user's password in Supabase Auth using the established recovery session
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                throw error
            }

            // Sign out of the temporary recovery session so the user logs in fresh
            await supabase.auth.signOut()

            console.log("✅ Password updated successfully")
            setSubmitted(true)
            toast.success("your password has been successfully chnaged")
        } catch (error: any) {
            console.error("❌ Password update error:", error)
            toast.error(error.message || "Failed to reset password. The link may have expired.")
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
                key="reset-password-layout"
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
                        key="reset-password-form-inner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-sm mx-auto mt-20"
                    >
                        {submitted ? (
                            /* ── Success State ── */
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
                                <h2 className="text-xl font-bold text-green-950 mb-2">Success</h2>
                                <p className="text-sm text-green-800 leading-relaxed font-medium">
                                    your password has been successfully chnaged
                                </p>
                                <div className="mt-6">
                                    <Link href="/login">
                                        <Button className="h-10 text-sm font-bold rounded-lg bg-[#0B2545] text-white">
                                            Log in
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ) : sessionError && !sessionReady ? (
                            /* ── Session Error State ── */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-red-50/50 border border-red-200/50 rounded-2xl p-6 shadow-sm backdrop-blur-sm"
                            >
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-red-950 mb-2">Link Expired</h2>
                                <p className="text-sm text-red-700 leading-relaxed">
                                    This password reset link is invalid or has expired. Please request a new one.
                                </p>
                                <div className="mt-6">
                                    <Link href="/forgot-password">
                                        <Button className="h-10 text-sm font-bold rounded-lg bg-secondary text-white">
                                            Request New Link
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ) : !sessionReady ? (
                            /* ── Loading / Awaiting Recovery Session ── */
                            <div className="flex flex-col items-center justify-center gap-4 py-16">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="text-sm text-muted-foreground text-center">Verifying your reset link&hellip;</p>
                            </div>
                        ) : (
                            /* ── Password Form ── */
                            <>
                                <h1 className="text-3xl font-bold text-primary mb-2">Set New Password</h1>
                                <p className="text-muted-foreground text-sm mb-6">Define your new high-strength password below.</p>

                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="new-password" className="text-sm font-medium text-foreground">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="h-11 pr-10 rounded-lg border-border/70 bg-white focus:border-primary focus:ring-primary/20"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Real-time Validation Rules Visualizer */}
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                                        <p className="text-xs font-semibold text-slate-500">Security Strength Rules:</p>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                            {[
                                                { key: "length", label: "Min 8 Characters" },
                                                { key: "uppercase", label: "1 Uppercase Letter" },
                                                { key: "lowercase", label: "1 Lowercase Letter" },
                                                { key: "number", label: "1 Digit / Number" },
                                                { key: "special", label: "1 Special Char (!@#$…)" },
                                            ].map(({ key, label }) => {
                                                const passed = passwordChecks[key as keyof typeof passwordChecks]
                                                return (
                                                    <div key={key} className="flex items-center gap-1.5">
                                                        <span className={`text-[10px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold transition-all ${passed ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"}`}>✓</span>
                                                        <span className={`text-xs transition-colors ${passed ? "text-green-700 font-medium" : "text-slate-500"}`}>{label}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="h-11 pr-10 rounded-lg border-border/70 bg-white focus:border-primary focus:ring-primary/20"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-bold rounded-lg bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group mt-2">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Reset Password
                                        </span>
                                    </Button>
                                </form>
                            </>
                        )}
                    </motion.div>

                    <p className="text-xs text-muted-foreground mt-16 lg:mt-0">&copy; Century Lands &amp; Homes {new Date().getFullYear()}</p>
                </div>

                {imagePanel}
            </motion.div>
        </AnimatePresence>
    )
}
