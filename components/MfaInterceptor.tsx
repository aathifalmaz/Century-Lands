"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

export default function MfaInterceptor({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [require2FA, setRequire2FA] = useState(false)
    const [otpCode, setOtpCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const activeUser = session?.user ?? null
            setUser(activeUser)

            if (activeUser && !pathname?.startsWith("/login")) {
                const has2FA = activeUser.user_metadata?.two_factor_enabled || false
                const isVerified = sessionStorage.getItem("2fa_verified") === "true"

                if (has2FA && !isVerified) {
                    setRequire2FA(true)
                    // Trigger email OTP immediately once
                    if (!otpSent) {
                        setOtpSent(true)
                        try {
                            const { error } = await supabase.auth.signInWithOtp({
                                email: activeUser.email!,
                                options: { shouldCreateUser: false }
                            })
                            if (error) throw error
                            toast.success("Two-Factor Authentication: A verification code has been sent to your email.")
                        } catch (err: any) {
                            console.error("MFA OTP send failure", err)
                            toast.error("Failed to send 2FA verification code: " + err.message)
                        }
                    }
                } else {
                    setRequire2FA(false)
                }
            } else {
                setRequire2FA(false)
            }
        }

        checkSession()

        // Subscribe to auth state updates
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            const activeUser = session?.user ?? null
            setUser(activeUser)
            
            if (activeUser && !pathname?.startsWith("/login")) {
                const has2FA = activeUser.user_metadata?.two_factor_enabled || false
                const isVerified = sessionStorage.getItem("2fa_verified") === "true"
                if (has2FA && !isVerified) {
                    setRequire2FA(true)
                } else {
                    setRequire2FA(false)
                }
            } else {
                setRequire2FA(false)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [pathname, otpSent])

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otpCode) {
            toast.error("Please enter the verification code.")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.verifyOtp({
                email: user.email!,
                token: otpCode,
                type: "email"
            })

            if (error) throw error

            sessionStorage.setItem("2fa_verified", "true")
            setRequire2FA(false)
            toast.success("Two-Factor Authentication verified successfully!")
        } catch (err: any) {
            console.error("MFA OTP verify failure", err)
            toast.error(err.message || "Invalid or expired verification code.")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        try {
            await supabase.auth.signOut()
            sessionStorage.removeItem("2fa_verified")
            setRequire2FA(false)
            setOtpSent(false)
            window.location.href = "/login"
        } catch (err: any) {
            console.error("Sign out failure", err)
        }
    }

    if (require2FA) {
        return (
            <div className="fixed inset-0 z-50 bg-[#0B2545]/90 backdrop-blur-md flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-border bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
                            <ShieldAlert className="h-6 w-6 text-yellow-600 animate-pulse" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-primary">Two-Factor Verification</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm mt-1">
                            A verification code has been sent to <strong>{user?.email}</strong>. Please enter the 6-digit code to verify your identity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="interceptor-otp" className="text-sm font-semibold text-primary">Verification Code</Label>
                                <Input
                                    id="interceptor-otp"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="h-12 rounded-xl text-center font-bold text-xl tracking-widest focus-visible:ring-emerald-500 focus:border-primary"
                                    required
                                    maxLength={6}
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2 pt-2">
                                <Button type="submit" disabled={loading} className="w-full h-11 bg-secondary text-white font-bold rounded-xl shadow hover:shadow-lg transition-all duration-300">
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Verifying...
                                        </div>
                                    ) : (
                                        "Confirm Identity"
                                    )}
                                </Button>
                                <Button type="button" variant="ghost" onClick={handleCancel} className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl">
                                    Cancel & Sign Out
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <>{children}</>
}
