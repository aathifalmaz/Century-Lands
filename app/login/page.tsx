"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ChevronLeft, ChevronRight, ArrowLeft, Phone, User } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/backend/auth"
import { sendMfaOtp } from "@/lib/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

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

/* ─── Google SVG icon (shared) ─── */
function GoogleIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

    /* ── login form state ── */
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    /* ── 2FA states ── */
    const [requireOtp, setRequireOtp] = useState(false)
    const [otpCode, setOtpCode] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState("")

    /* ── sign-up form state ── */
    const [signupName, setSignupName] = useState("")
    const [signupEmail, setSignupEmail] = useState("")
    const [signupPhone, setSignupPhone] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [signupConfirm, setSignupConfirm] = useState("")
    const [showSignupPassword, setShowSignupPassword] = useState(false)
    const [showSignupConfirm, setShowSignupConfirm] = useState(false)

    /* ── testimonial state ── */
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search)
            const error = params.get("error")
            if (error) {
                toast.error(decodeURIComponent(error))
                // Clear the error parameter from URL
                const newUrl = window.location.pathname
                window.history.replaceState({}, document.title, newUrl)
            }
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("🚀 Login attempt started for:", email)
        setLoading(true)
        try {
            const { data, error } = await signInWithEmail(email, password)
            if (error) {
                console.warn("❌ Login error details:", error.message || error)

                // Map common Supabase error messages to more user-friendly ones
                let errorMessage = error.message || "Failed to login"

                if (errorMessage === "Invalid login credentials") {
                    errorMessage = "Invalid email or password. Please try again."
                } else if (errorMessage.toLowerCase().includes("database error")) {
                    errorMessage = "Database connection error. Please try again later."
                }

                toast.error(errorMessage)
                setLoading(false)
                return
            }

            console.log("✅ Login password check success:", data?.user?.id)

            // Intercept if Two-Factor Authentication is enabled
            if (data?.user?.user_metadata?.two_factor_enabled) {
                console.log("🔒 2FA is active, sending OTP...")
                // Sign out instantly so client session is not persisted until OTP is confirmed
                await supabase.auth.signOut()

                // Request email OTP
                const res = await sendMfaOtp(email, window.location.origin)

                if (!res.success || res.error) {
                    toast.error(res.error || "Failed to send OTP code")
                    setLoading(false)
                    return
                }

                setOtpEmail(email)
                setRequireOtp(true)
                if (res.sandboxNotice) {
                    toast.warning(res.sandboxNotice, { duration: 10000 })
                } else {
                    toast.success("Two-Factor Authentication: A verification code has been sent to your email.")
                }
            } else {
                toast.success("Login successful!")
                router.push("/")
            }
        } catch (error: any) {
            console.warn("❌ Login unexpected error:", error.message || error)
            toast.error(error.message || "Failed to login")
        } finally {
            setLoading(false)
            console.log("🏁 Login attempt finished")
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otpCode) {
            toast.error("Please enter the verification code.")
            return
        }

        setOtpLoading(true)
        try {
            console.log("🔑 Attempting OTP verification for:", otpEmail)
            const { data, error } = await supabase.auth.verifyOtp({
                email: otpEmail,
                token: otpCode,
                type: "email"
            })

            if (error) {
                console.warn("❌ OTP Verification error details:", error.message || error)
                toast.error(error.message || "Invalid or expired verification code.")
                setOtpLoading(false)
                return
            }

            console.log("✅ OTP verification successful:", data.user?.id)
            sessionStorage.setItem("2fa_verified", "true")
            toast.success("Two-Factor Authentication verified! Login successful.")
            router.push("/")
        } catch (error: any) {
            console.warn("❌ OTP Verification unexpected error:", error.message || error)
            toast.error(error.message || "Invalid or expired verification code.")
        } finally {
            setOtpLoading(false)
        }
    }

    const handleBackToLogin = () => {
        setRequireOtp(false)
        setOtpCode("")
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // 1. Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(signupEmail.trim())) {
            toast.error("Please enter a valid email address containing '@' and a valid domain.")
            return
        }

        // 2. Password length validation
        if (signupPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.")
            return
        }

        // 3. Password uppercase letter validation
        if (!/[A-Z]/.test(signupPassword)) {
            toast.error("Password must contain at least one uppercase capital letter.")
            return
        }

        // 4. Password lowercase letter validation
        if (!/[a-z]/.test(signupPassword)) {
            toast.error("Password must contain at least one lowercase letter.")
            return
        }

        // 5. Password numeric digit validation
        if (!/[0-9]/.test(signupPassword)) {
            toast.error("Password must contain at least one numeric digit.")
            return
        }

        // 6. Password special character validation
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(signupPassword)) {
            toast.error("Password must contain at least one special character (e.g. !@#$%^&*).")
            return
        }

        // 7. Password match confirmation
        if (signupPassword !== signupConfirm) {
            toast.error("Passwords do not match.")
            return
        }

        setLoading(true)
        try {
            const { data, error } = await signUpWithEmail(signupEmail, signupPassword, {
                full_name: signupName,
                phone: signupPhone
            })
            if (error) {
                console.warn("❌ Signup error details:", error.message || error)
                toast.error(error.message || "Failed to create account")
                setLoading(false)
                return
            }
            
            toast.success("Please verify your account through the link sent to your email to complete registration.")
            setActiveTab("login")
        } catch (error: any) {
            console.warn("❌ Signup unexpected error:", error.message || error)
            toast.error(error.message || "Failed to create account")
        } finally {
            setLoading(false)
        }
    }


    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle()
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in with Google")
        }
    }

    const nextTestimonial = () =>
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    const prevTestimonial = () =>
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    const current = testimonials[activeTestimonial]

    /* ─── Shared Components as JSX constants to avoid remounting ─── */
    const tabBar = (
        <div className="flex border-b border-border/50 mb-6">
            <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${activeTab === "login"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                Log in
                {activeTab === "login" && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
            </button>
            <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${activeTab === "signup"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                Sign up
                {activeTab === "signup" && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
            </button>
        </div>
    )

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
            {activeTab === "login" ? (
                <motion.div
                    key="login-layout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="min-h-screen flex flex-col lg:flex-row relative"
                >
                    <BackgroundDecor />
                    {/* LoginForm Inlined */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-between items-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24 py-10 bg-white/80 backdrop-blur-xl relative">
                        <div className="absolute top-8 left-8">
                            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors group">
                                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                Back to Home
                            </Link>
                        </div>

                        <motion.div
                            key="login-form-inner"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-sm mx-auto mt-20"
                        >
                            {requireOtp ? (
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-primary mb-2">Verification</h1>
                                        <p className="text-muted-foreground text-sm">
                                            We sent a secure verification code to <strong>{otpEmail}</strong>. Please enter it below to access your account.
                                        </p>
                                    </div>

                                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="otp-code" className="text-sm font-medium text-foreground">Verification Code</Label>
                                            <Input
                                                id="otp-code"
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                className="h-11 rounded-lg border-border/70 bg-white text-center font-semibold text-lg tracking-widest focus:border-primary focus:ring-primary/20"
                                                required
                                                maxLength={6}
                                            />
                                        </div>

                                        <Button type="submit" disabled={otpLoading} className="w-full h-11 text-sm font-bold rounded-lg bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {otpLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                                Verify & Login
                                            </span>
                                        </Button>

                                        <button
                                            type="button"
                                            onClick={handleBackToLogin}
                                            className="w-full text-center text-sm font-semibold text-secondary hover:text-primary transition-colors mt-4 block"
                                        >
                                            Back to login
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-primary mb-2">Welcome</h1>
                                    <p className="text-muted-foreground text-sm mb-6">Please enter your details to login.</p>

                                    {tabBar}

                                    <form onSubmit={handleLogin} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="login-email" className="text-sm font-medium text-foreground">Email</Label>
                                            <Input id="login-email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-lg border-border/70 bg-white focus:border-primary focus:ring-primary/20" required />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="login-password" className="text-sm font-medium text-foreground">Password</Label>
                                            <div className="relative">
                                                <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pr-10 rounded-lg border-border/70 bg-white focus:border-primary focus:ring-primary/20" required />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox id="remember" className="border-border/70" />
                                                <Label htmlFor="remember" className="text-sm text-muted-foreground transition-colors cursor-pointer select-none">Remember for 30 days</Label>
                                            </div>
                                            <Link href="/forgot-password" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Forgot password</Link>
                                        </div>

                                        <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-bold rounded-lg bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                                Sign in
                                            </span>
                                        </Button>

                                        <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full h-11 rounded-lg border-border/70 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-semibold text-foreground">
                                            <GoogleIcon />
                                            Sign in with Google
                                        </Button>
                                    </form>

                                    <p className="text-center text-sm text-muted-foreground mt-8">
                                        Don&apos;t have an account?{" "}
                                        <button type="button" onClick={() => setActiveTab("signup")} className="font-semibold text-secondary hover:text-primary transition-colors">
                                            Sign up
                                        </button>
                                    </p>
                                </>
                            )}
                        </motion.div>

                        <p className="text-xs text-muted-foreground mt-12 lg:mt-0">&copy; Century Lands &amp; Homes {new Date().getFullYear()}</p>
                    </div>
                    {imagePanel}
                </motion.div>
            ) : (
                <motion.div
                    key="signup-layout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="min-h-screen flex flex-col lg:flex-row relative"
                >
                    <BackgroundDecor />
                    {imagePanel}
                    {/* SignupForm Inlined */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-between items-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24 py-10 bg-white/80 backdrop-blur-xl relative">
                        <div className="absolute top-8 right-8">
                            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors group">
                                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                Back to Home
                            </Link>
                        </div>

                        <motion.div
                            key="signup-form-inner"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-sm mx-auto"
                        >
                            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
                            <p className="text-muted-foreground text-sm mb-6">Join Century Lands &amp; Homes today.</p>

                            {tabBar}

                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="signup-name" type="text" placeholder="John Doe" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="h-11 pl-10 rounded-lg border-border/70 bg-white" required />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</Label>
                                    <Input id="signup-email" type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="h-11 rounded-lg border-border/70 bg-white" required />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="signup-phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="signup-phone" type="tel" placeholder="+94 7X XXX XXXX" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} className="h-11 pl-10 rounded-lg border-border/70 bg-white" required />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="signup-password" title="At least 6 characters" className="text-sm font-medium text-foreground">Password</Label>
                                    <div className="relative">
                                        <Input id="signup-password" type={showSignupPassword ? "text" : "password"} placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="h-11 pr-10 rounded-lg border-border/70 bg-white" required minLength={6} />
                                        <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                            {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="signup-confirm" className="text-sm font-medium text-foreground">Confirm Password</Label>
                                    <div className="relative">
                                        <Input id="signup-confirm" type={showSignupConfirm ? "text" : "password"} placeholder="••••••••" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} className="h-11 pr-10 rounded-lg border-border/70 bg-white" required />
                                        <button type="button" onClick={() => setShowSignupConfirm(!showSignupConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                            {showSignupConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-bold rounded-lg bg-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Sign up
                                    </span>
                                </Button>

                                <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full h-11 rounded-lg border-border/70 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-semibold text-foreground">
                                    <GoogleIcon />
                                    Sign up with Google
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground mt-6">
                                Already have an account?{" "}
                                <button type="button" onClick={() => setActiveTab("login")} className="font-semibold text-secondary hover:text-primary transition-colors">
                                    Log in
                                </button>
                            </p>
                        </motion.div>

                        <p className="text-xs text-muted-foreground mt-12 lg:mt-0">&copy; Century Lands &amp; Homes {new Date().getFullYear()}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
