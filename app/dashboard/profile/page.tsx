"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Lock, Bell, FileText, AlertTriangle, ShieldCheck, Loader2, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { deleteUserAccountAndData, deleteR2FileAction } from "@/lib/actions/auth"

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Form states
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [bio, setBio] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")

    // Security (Password) states
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [updatingPassword, setUpdatingPassword] = useState(false)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

    // Documents states
    const [documents, setDocuments] = useState<any[]>([])
    const [loadingDocs, setLoadingDocs] = useState(false)
    const [uploadingDoc, setUploadingDoc] = useState(false)

    const fetchDocuments = async (userId: string) => {
        setLoadingDocs(true)
        try {
            const { data, error } = await supabase
                .from("user_documents")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
            if (error) throw error
            setDocuments(data || [])
        } catch (err: any) {
            console.error("Error loading documents:", err)
            toast.error("Failed to load documents: " + (err.message || "Unknown error"))
        } finally {
            setLoadingDocs(false)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
                const { data: { session } } = await supabase.auth.getSession()
                const loggedInUser = session?.user ?? null
                setUser(loggedInUser)

                if (loggedInUser) {
                    setFullName(loggedInUser.user_metadata?.full_name || "")
                    setEmail(loggedInUser.email || "")
                    setPhone(loggedInUser.user_metadata?.phone || "")
                    setAddress(loggedInUser.user_metadata?.address || "")
                    setBio(loggedInUser.user_metadata?.bio || "")
                    setAvatarUrl(loggedInUser.user_metadata?.avatar_url || "")
                    setTwoFactorEnabled(loggedInUser.user_metadata?.two_factor_enabled || false)
                    fetchDocuments(loggedInUser.id)
                }
            } catch (error: any) {
                console.error("Error loading user profile:", error)
                toast.error("Failed to load user profile: " + (error.message || "Unknown error"))
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const handleAvatarClick = () => {
        const fileInput = document.getElementById("avatar-upload-input")
        if (fileInput) fileInput.click()
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            // Validation: File size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image file size must be less than 5MB.")
                return
            }

            // Validation: File type
            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed.")
                return
            }

            setUploading(true)
            try {
                // Delete old avatar from R2 if it exists
                if (avatarUrl) {
                    await deleteR2FileAction(avatarUrl)
                }

                const formData = new FormData()
                formData.append("file", file)
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                })
                if (!res.ok) {
                    const errText = await res.text()
                    throw new Error(errText || "Upload failed")
                }
                const data = await res.json()
                const newAvatarUrl = data.url

                // Update in database with Supabase user auth metadata
                const { data: updateData, error: updateError } = await supabase.auth.updateUser({
                    data: { avatar_url: newAvatarUrl }
                })
                if (updateError) throw updateError

                setAvatarUrl(newAvatarUrl)
                toast.success("Avatar updated successfully!")
                if (updateData?.user) {
                    setUser(updateData.user)
                }
            } catch (err: any) {
                console.error("Avatar upload failed", err)
                toast.error("Failed to upload avatar: " + (err.message || "Unknown error"))
            } finally {
                setUploading(false)
            }
        }
    }

    const handleRemoveAvatar = async () => {
        setUploading(true)
        try {
            // Delete from R2 if it exists
            if (avatarUrl) {
                await deleteR2FileAction(avatarUrl)
            }

            const { data: updateData, error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: "" }
            })
            if (updateError) throw updateError

            setAvatarUrl("")
            toast.success("Avatar removed successfully!")
            if (updateData?.user) {
                setUser(updateData.user)
            }
        } catch (err: any) {
            console.error("Failed to remove avatar:", err)
            toast.error("Failed to remove avatar: " + (err.message || "Unknown error"))
        } finally {
            setUploading(false)
        }
    }

    const handleSaveChanges = async () => {
        // Validation: Fields
        if (!fullName.trim()) {
            toast.error("Full Name is required.")
            return
        }

        if (!email.trim()) {
            toast.error("Email Address is required.")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            toast.error("Please enter a valid email address.")
            return
        }

        if (phone && !/^\+?[0-9\s\-()]{7,20}$/.test(phone.trim())) {
            toast.error("Please enter a valid phone number (7-20 digits).")
            return
        }

        setSaving(true)
        try {
            const { data, error } = await supabase.auth.updateUser({
                email: email !== user?.email ? email : undefined,
                data: {
                    full_name: fullName.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                    bio: bio.trim()
                }
            })

            if (error) throw error

            toast.success("Profile details updated successfully!")
            setUser(data.user)
        } catch (error: any) {
            toast.error("Failed to update profile details: " + (error.message || "Unknown error"))
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (user) {
            setFullName(user.user_metadata?.full_name || "")
            setEmail(user.email || "")
            setPhone(user.user_metadata?.phone || "")
            setAddress(user.user_metadata?.address || "")
            setBio(user.user_metadata?.bio || "")
            setAvatarUrl(user.user_metadata?.avatar_url || "")
            toast.info("Changes discarded.")
        }
    }

    const handleDeleteAccount = async () => {
        if (!user) return
        const confirmed = window.confirm("Are you sure you want to permanently delete your account? This will permanently delete your profile, saved properties, appointments, and inquiries from the database. This action is irreversible.")
        if (!confirmed) return

        setSaving(true)
        try {
            const res = await deleteUserAccountAndData(user.id, user.email)
            if (!res.success) throw new Error(res.error)

            toast.success("Account successfully deleted.")
            await supabase.auth.signOut()
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("2fa_verified")
            }
            window.location.href = "/"
        } catch (error: any) {
            console.error("Account deletion failed:", error)
            toast.error("Failed to delete account: " + (error.message || "Unknown error"))
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required.")
            return
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.")
            return
        }

        setUpdatingPassword(true)
        try {
            // Re-authenticate user with current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword
            })

            if (signInError) {
                toast.error("Current password is incorrect.")
                setUpdatingPassword(false)
                return
            }

            // Update to new password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) {
                throw updateError
            }

            toast.success("Password updated successfully!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (error: any) {
            console.error("Password update failed:", error)
            toast.error("Failed to update password: " + (error.message || "Unknown error"))
        } finally {
            setUpdatingPassword(false)
        }
    }

    const handleTwoFactorToggle = async (checked: boolean) => {
        setTwoFactorEnabled(checked)
        try {
            const { error } = await supabase.auth.updateUser({
                data: { two_factor_enabled: checked }
            })
            if (error) throw error
            toast.success(checked ? "Two-Factor Authentication enabled!" : "Two-Factor Authentication disabled.")
        } catch (err: any) {
            setTwoFactorEnabled(!checked)
            toast.error("Failed to update 2FA setting: " + (err.message || "Unknown error"))
        }
    }

    const handleDocumentClick = () => {
        const fileInput = document.getElementById("document-upload-input")
        if (fileInput) fileInput.click()
    }

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && user) {
            const file = e.target.files[0]

            // Validation: File size (limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Document size must be less than 10MB.")
                return
            }

            // Validation: File type (PDF, doc/docx, images)
            const allowedTypes = [
                'application/pdf', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                'image/jpeg', 
                'image/png'
            ]
            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.")
                return
            }

            setUploadingDoc(true)
            try {
                const formData = new FormData()
                formData.append("file", file)
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                })
                if (!res.ok) {
                    const errText = await res.text()
                    throw new Error(errText || "Upload failed")
                }
                const data = await res.json()
                const documentUrl = data.url

                // Save to database
                const { error: insertError } = await supabase
                    .from("user_documents")
                    .insert({
                        user_id: user.id,
                        name: file.name,
                        url: documentUrl,
                        size: formatBytes(file.size),
                        status: "Pending"
                    })
                if (insertError) throw insertError

                toast.success("Document uploaded successfully!")
                
                // Refresh list
                const { data: updatedDocs, error: fetchErr } = await supabase
                    .from("user_documents")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                if (fetchErr) throw fetchErr
                setDocuments(updatedDocs || [])
            } catch (err: any) {
                console.error("Document upload failed", err)
                toast.error("Failed to upload document: " + (err.message || "Unknown error"))
            } finally {
                setUploadingDoc(false)
            }
        }
    }

    const handleDeleteDocument = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this document?")) return
        try {
            // Find and delete the file from R2
            const docToDelete = documents.find(doc => doc.id === id)
            if (docToDelete?.url) {
                await deleteR2FileAction(docToDelete.url)
            }

            const { error } = await supabase
                .from("user_documents")
                .delete()
                .eq("id", id)
            if (error) throw error

            toast.success("Document deleted.")
            setDocuments(prev => prev.filter(doc => doc.id !== id))
        } catch (err: any) {
            console.error("Document deletion failed:", err)
            toast.error("Failed to delete document: " + (err.message || "Unknown error"))
        }
    }


    const userInitials = fullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="general" className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-third">Profile Settings</h1>
                        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
                    </div>
                    <TabsList className="bg-white border border-border/50 p-1 rounded-xl h-auto flex-wrap">
                        <TabsTrigger value="general" className="py-2 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary rounded-lg">General</TabsTrigger>
                        <TabsTrigger value="security" className="py-2 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary rounded-lg">Security</TabsTrigger>
                        <TabsTrigger value="documents" className="py-2 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary rounded-lg">Documents</TabsTrigger>
                    </TabsList>
                </div>

                {/* ─── GENERAL TAB ─── */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="border-border/60 bg-white rounded-2xl overflow-hidden shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-primary">Profile Information</CardTitle>
                            <CardDescription>Update your photo and personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Left side: Avatar Upload */}
                                <div className="flex flex-col items-center gap-3 w-full md:w-auto md:shrink-0 md:border-r md:border-border/50 md:pr-6">
                                    <div className="relative group" onClick={handleAvatarClick}>
                                        <Avatar className="h-20 w-20 border border-slate-200 cursor-pointer shadow-sm relative overflow-hidden">
                                            <AvatarImage src={avatarUrl} className="object-cover" />
                                            <AvatarFallback className="text-xl bg-slate-50 text-slate-400 font-bold">{userInitials}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10">
                                            {uploading ? (
                                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                                            ) : (
                                                <Camera className="h-6 w-6 text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 w-full">
                                        <input
                                            type="file"
                                            id="avatar-upload-input"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                        <div className="flex gap-2 w-full justify-center">
                                            <Button variant="outline" size="sm" onClick={handleAvatarClick} disabled={uploading} className="rounded-lg text-xs px-2.5 h-8">
                                                Change
                                            </Button>
                                            {avatarUrl && (
                                                <Button variant="ghost" size="sm" onClick={handleRemoveAvatar} disabled={uploading} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg text-xs px-2.5 h-8">
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: Personal Info Form */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                    <div className="space-y-1">
                                        <Label htmlFor="fullName" className="text-xs font-semibold text-primary">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="h-9 rounded-lg text-sm focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-xs font-semibold text-primary">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-9 rounded-lg text-sm focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="phone" className="text-xs font-semibold text-primary">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="h-9 rounded-lg text-sm focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="address" className="text-xs font-semibold text-primary">Address</Label>
                                        <Input
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="h-9 rounded-lg text-sm focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="bio" className="text-xs font-semibold text-primary">Bio / About (Optional)</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us a little about yourself"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="resize-none h-16 rounded-lg text-sm focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t border-border/40 p-4 bg-gray-50/50">
                            <Button variant="ghost" onClick={handleCancel} disabled={saving} className="rounded-xl">Cancel</Button>
                            <Button onClick={handleSaveChanges} disabled={saving} className="bg-primary hover:bg-secondary text-white rounded-xl px-5 h-10 font-semibold shadow">
                                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* ─── SECURITY TAB ─── */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="border-border/60 bg-white rounded-2xl overflow-hidden shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-primary">Password</CardTitle>
                            <CardDescription>Change your password to keep your account secure.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="current" className="font-semibold text-primary">Current Password</Label>
                                <Input
                                    id="current"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="h-11 rounded-xl focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new" className="font-semibold text-primary">New Password</Label>
                                <Input
                                    id="new"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-11 rounded-xl focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm" className="font-semibold text-primary">Confirm Password</Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-11 rounded-xl focus-visible:ring-emerald-500"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-border/40 p-4 bg-gray-50/50">
                            <Button
                                onClick={handleUpdatePassword}
                                disabled={updatingPassword}
                                className="bg-primary hover:bg-secondary text-white rounded-xl px-5 h-10 font-semibold shadow"
                            >
                                {updatingPassword && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-border/60 bg-white rounded-2xl overflow-hidden shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-primary">Two-Factor Authentication</CardTitle>
                                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                                </div>
                                <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
                            </div>
                        </CardHeader>
                    </Card>
                </TabsContent>



                {/* ─── DOCUMENTS TAB ─── */}
                <TabsContent value="documents" className="space-y-6">
                    <Card className="border-border/60 bg-white rounded-2xl overflow-hidden shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-primary">Verification Documents</CardTitle>
                            <CardDescription>Upload necessary documents for property transactions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <input
                                type="file"
                                id="document-upload-input"
                                onChange={handleDocumentUpload}
                                className="hidden"
                                disabled={uploadingDoc}
                            />
                            
                            <div 
                                onClick={handleDocumentClick}
                                className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="h-10 w-10 text-muted-foreground mb-4">
                                    {uploadingDoc ? (
                                        <Loader2 className="h-full w-full animate-spin text-primary" />
                                    ) : (
                                        <FileText className="h-full w-full text-primary" />
                                    )}
                                </div>
                                <h3 className="font-semibold text-primary">Upload Verification Document</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">
                                    {uploadingDoc ? "Uploading your file..." : "Click to select a file for upload"}
                                </p>
                                <Button variant="outline" size="sm" disabled={uploadingDoc} className="rounded-xl">
                                    {uploadingDoc && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Select File
                                </Button>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-primary">Uploaded Documents</h4>
                                
                                {loadingDocs ? (
                                    <div className="flex justify-center p-6">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : documents.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic py-2 text-center bg-gray-50/50 rounded-lg border border-dashed">
                                        No documents uploaded yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center p-3 border rounded-lg bg-gray-50 justify-between gap-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                        <FileText className="h-5 w-5 text-slate-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <a 
                                                            href={doc.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-sm font-semibold text-primary hover:underline block truncate hover:text-secondary"
                                                            title={doc.name}
                                                        >
                                                            {doc.name}
                                                        </a>
                                                        <p className="text-xs text-muted-foreground">
                                                            {doc.size || "Unknown Size"} • Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={
                                                            doc.status === "Verified" 
                                                                ? "bg-green-50 text-green-700 border-green-200" 
                                                                : doc.status === "Rejected"
                                                                ? "bg-red-50 text-red-700 border-red-200"
                                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                        }
                                                    >
                                                        {doc.status || "Pending"}
                                                    </Badge>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => handleDeleteDocument(doc.id)}
                                                        className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Danger Zone */}
            <div className="mt-12">
                <Card className="border-destructive/30 bg-destructive/10 rounded-2xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 animate-pulse" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>Irreversible actions for your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Delete Account</p>
                                <p className="text-sm text-muted-foreground">Permanently remove your account and all data.</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={saving}
                                className="rounded-xl font-semibold"
                            >
                                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
