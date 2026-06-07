"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { Save, Shield, Bell, Globe } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="p-4 space-y-4 min-h-screen">
            <BackgroundDecor />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Manage your admin portal preferences and system configuration.</p>
                </div>
                <Button className="hover:bg-secondary">
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* General Settings */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle>Global Configuration</CardTitle>
                        </div>
                        <CardDescription>Manage global site settings and defaults.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input id="siteName" defaultValue="Century Lands & Homes" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input id="supportEmail" defaultValue="support@centurylands.lk" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Default Currency</Label>
                            <Select defaultValue="lkr">
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lkr">LKR (Sri Lankan Rupee)</SelectItem>
                                    <SelectItem value="usd">USD (US Dollar)</SelectItem>
                                    <SelectItem value="aud">AUD (Australian Dollar)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="language">Default Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="si">Sinhala</SelectItem>
                                    <SelectItem value="ta">Tamil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-600" />
                            <CardTitle>Access & Security</CardTitle>
                        </div>
                        <CardDescription>Manage security protocols.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4 bg-slate-50/50">
                            <div className="space-y-0.5">
                                <Label className="text-base">Two-Factor Auth</Label>
                                <p className="text-xs text-muted-foreground">Require 2FA for admin logins.</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 bg-slate-50/50">
                            <div className="space-y-0.5">
                                <Label className="text-base">Force Password Reset</Label>
                                <p className="text-xs text-muted-foreground">Every 90 days.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 bg-slate-50/50">
                            <div className="space-y-0.5">
                                <Label className="text-base">Session Timeout</Label>
                                <p className="text-xs text-muted-foreground">Auto-logout after 30 mins.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-orange-500" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>Configure email triggers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex-1 text-sm font-medium">New Property Listing</Label>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <Label className="flex-1 text-sm font-medium">New User Registration</Label>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <Label className="flex-1 text-sm font-medium">New CRM Lead</Label>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <Label className="flex-1 text-sm font-medium">System Errors</Label>
                            <Switch />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <Label className="flex-1 text-sm font-medium">Weekly Reports</Label>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
