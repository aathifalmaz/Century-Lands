"use strict";
import { UserNav } from "@/components/UserNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminNavbar() {
    return (
        <div className="flex items-center p-4 lg:hidden">
            <Sheet>
                <SheetTrigger className="lg:hidden pr-4">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-slate-900">
                    <AdminSidebar />
                </SheetContent>
            </Sheet>

            <div className="flex w-full justify-end">
                <UserNav />
            </div>
        </div>
    );
}
