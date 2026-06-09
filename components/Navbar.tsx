"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import NextImage from "next/image"
import { User, Menu, X, Shield } from "lucide-react"
import { UserNav } from "@/components/UserNav"
import { supabase } from "@/lib/supabase"

interface NavbarProps {
    forceScrolled?: boolean
}

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
]

export function Navbar({ forceScrolled = false }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(forceScrolled)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const pathname = usePathname()
    const isAdmin = user?.user_metadata?.role?.toLowerCase() === "admin"

    useEffect(() => {
        // Initial session check
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        checkUser()

        // Auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        if (forceScrolled) {
            return () => {
                subscription.unsubscribe()
            }
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            subscription.unsubscribe()
        }
    }, [forceScrolled])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">

            {/* 🔹 Background Blur Layer */}
            <div
                className={cn(
                    "absolute inset-0 backdrop-blur-xl border-b transition-all duration-500",
                    isScrolled
                        ? "bg-white/80 border-border/30 shadow-lg"
                        : "bg-white/10 border-white/10"
                )}
            />

            {/* 🔹 Content Layer */}
            <div className="relative w-full max-w-[1920px] mx-auto px-4 md:px-12 py-4 flex items-center justify-end h-20">

                {/* Logo - Absolute Far Left */}
                <Link href="/" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 group">
                    <div className="relative h-12 w-[140px] md:h-16 md:w-[200px] transition-transform duration-300 group-hover:scale-105 origin-left">
                        <NextImage
                            src="/site_logo.png"
                            alt="Century Lands & Homes"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation - Centered Absolute */}
                <div className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    {navLinks.map((item) => {
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "relative text-lg font-medium transition-all duration-300 group",
                                    isScrolled ? "text-primary hover:text-secondary" : "text-white hover:text-accent",
                                    isActive && (isScrolled ? "text-secondary" : "text-accent")
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block transition-all duration-300 group-hover:scale-105",
                                        isActive && "scale-105"
                                    )}
                                >
                                    {item.label}
                                </span>

                                <span className={cn(
                                    "absolute left-1/2 -bottom-1 h-0.5 bg-gradient-to-r from-secondary to-accent transition-all duration-300 -translate-x-1/2",
                                    isActive ? "w-full" : "w-0 group-hover:w-full"
                                )} />
                            </Link>
                        )
                    })}
                </div>

                {/* Actions - Far Right */}
                <div className="hidden lg:flex items-center gap-4 relative z-20">
                    {/* Admin Access Button (Only Available for Admin users) */}
                    {isAdmin && (
                        <Link href="/admin">
                            <Button className={cn(
                                "h-10 px-5 text-sm font-bold shadow-lg transition-all duration-300 rounded-full border border-white/10 flex items-center gap-2 group relative overflow-hidden active:scale-[0.98] hover:scale-[1.02]",
                                isScrolled
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200/50"
                                    : "bg-emerald-700/80 text-white hover:bg-emerald-600 hover:shadow-emerald-900/40 backdrop-blur-md"
                            )}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <Shield className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300 text-emerald-100" />
                                <span className="relative z-10">Admin Portal</span>
                            </Button>
                        </Link>
                    )}

                    {user ? (
                        <UserNav user={user} />
                    ) : (
                        <Link href="/login">
                            <Button className="h-10 px-5 text-sm font-bold bg-primary text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:bg-secondary active:scale-[0.98] transition-all duration-300 rounded-full border border-white/10 flex items-center gap-2 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                                <span className="relative z-10">Login</span>
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Trigger */}
                <div className="lg:hidden relative z-20">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={cn(
                            "rounded-full",
                            isScrolled ? "text-primary" : "text-white"
                        )}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>

            {/* 🔹 Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="relative lg:hidden border-b border-border/20 bg-white/95 backdrop-blur-xl px-5 py-4 flex flex-col gap-3 animate-in slide-in-from-top duration-300">
                    {navLinks.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "text-base font-medium px-2 py-1 transition-colors",
                                    isActive ? "text-secondary font-bold" : "text-primary hover:text-secondary"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        )
                    })}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/20 mt-1">
                        {isAdmin && (
                            <Link href="/admin" className="flex-1">
                                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all">
                                    <Shield className="h-4 w-4" />
                                    Admin Portal
                                </Button>
                            </Link>
                        )}
                        {user ? (
                            <div className="flex-1">
                                <UserNav user={user} displayUserDetails={true} align="start" side="top" themeType="light" />
                            </div>
                        ) : (
                            <Link href="/login" className="flex-1">
                                <Button className="w-full h-11 bg-primary text-white font-semibold rounded-full hover:bg-secondary transition-all">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
