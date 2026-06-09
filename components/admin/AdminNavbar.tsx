"use client";

import { UserNav } from "@/components/UserNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function AdminNavbar() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <div className="flex items-center p-4 lg:hidden">
            <Sheet>
                <SheetTrigger className="lg:hidden pr-4">
                    <Menu className="text-[#0b2545]" />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-slate-900">
                    <AdminSidebar />
                </SheetContent>
            </Sheet>

            <div className="flex w-full justify-end">
                <UserNav user={user} />
            </div>
        </div>
    );
}
