"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreditCard, LayoutDashboard, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/backend/auth"
import { toast } from "sonner"

interface UserNavProps {
    align?: "center" | "end" | "start"
    side?: "top" | "right" | "bottom" | "left"
    displayUserDetails?: boolean
    user?: any
}

export function UserNav({ align = "end", side = "bottom", displayUserDetails = false, user }: UserNavProps) {
    const router = useRouter()

    if (!user) return null

    const userData = {
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || ""
    }

    const initials = userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success("Signed out successfully")
            router.refresh()
            router.push("/")
        } catch (error: any) {
            toast.error("Failed to sign out")
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                    "relative shrink-0",
                    displayUserDetails ? "w-full justify-start h-auto p-2 gap-3 rounded-xl hover:bg-white/10" : "h-10 w-10 rounded-full"
                )}>
                    {displayUserDetails ? (
                        <div className="h-10 w-10 rounded-full p-[3px] bg-[conic-gradient(from_0deg,hsl(var(--primary)),hsl(var(--secondary)),hsl(var(--accent)),hsl(var(--primary)))] shrink-0">
                            <Avatar className="h-full w-full border border-border">
                                <AvatarImage src={userData.avatar} alt={userData.name} />
                                <AvatarFallback className="bg-primary text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                        <Avatar className="h-10 w-10 border border-zinc-200">
                            <AvatarImage src={userData.avatar} alt={userData.name} />
                            <AvatarFallback className="bg-primary text-white font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    )}

                    {displayUserDetails && (
                        <div className="flex flex-col items-start text-left">
                            <span className="text-sm font-medium text-white">{userData.name}</span>
                            <span className="text-xs text-zinc-400">{userData.email}</span>
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-[100]" align={align} side={side} forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userData.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userData.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {user?.user_metadata?.role?.toLowerCase() === "admin" && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin" className="w-full cursor-pointer">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Admin Portal</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full cursor-pointer text-[#0B2545] font-semibold">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
