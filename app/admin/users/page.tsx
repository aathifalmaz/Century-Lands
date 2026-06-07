"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, UserPlus, Shield, ShieldAlert, ShieldCheck, Mail, User, Ban, Pencil, MoreVertical, Loader2, Trash } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { adminListUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from "@/lib/actions/auth"
import { toast } from "sonner"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("All")

    // Dialog States
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)

    // Form State
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", role: "User", status: "Active", department: "", password: ""
    })

    const loadUsers = async () => {
        setLoading(true)
        const res = await adminListUsers()
        if (res.success) {
            setUsers(res.users || [])
        } else {
            toast.error(res.error || "Failed to load users")
        }
        setLoading(false)
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const filteredUsers = users.filter(user => {
        const nameVal = user.name || ""
        const emailVal = user.email || ""
        const matchesSearch = nameVal.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emailVal.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "All" || user.role === roleFilter
        const matchesStatus = statusFilter === "All" || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await adminCreateUser({
            email: formData.email,
            password: formData.password || undefined,
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            department: formData.department
        })
        setLoading(false)
        if (res.success) {
            toast.success("User account created successfully!")
            setIsAddOpen(false)
            resetForm()
            loadUsers()
        } else {
            toast.error(res.error || "Failed to create user account")
        }
    }

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await adminUpdateUser(currentUser.id, {
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            department: formData.department,
            email: formData.email !== currentUser.email ? formData.email : undefined
        })
        setLoading(false)
        if (res.success) {
            toast.success("User updated successfully!")
            setIsEditOpen(false)
            setCurrentUser(null)
            resetForm()
            loadUsers()
        } else {
            toast.error(res.error || "Failed to update user")
        }
    }

    const resetForm = () => {
        setFormData({ name: "", email: "", phone: "", role: "User", status: "Active", department: "", password: "" })
    }

    const openEditDialog = (user: any) => {
        setCurrentUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            department: user.department,
            password: ""
        })
        setIsEditOpen(true)
    }

    const deactivateUser = async (id: string) => {
        const userToDeactivate = users.find(u => u.id === id)
        if (!userToDeactivate) return
        
        setLoading(true)
        const res = await adminUpdateUser(id, {
            name: userToDeactivate.name,
            phone: userToDeactivate.phone,
            role: userToDeactivate.role,
            status: "Inactive",
            department: userToDeactivate.department
        })
        setLoading(false)
        if (res.success) {
            toast.success("User deactivated successfully!")
            loadUsers()
        } else {
            toast.error(res.error || "Failed to deactivate user")
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (confirm("Are you sure you want to permanently delete this user?")) {
            setLoading(true)
            const res = await adminDeleteUser(id)
            setLoading(false)
            if (res.success) {
                toast.success("User deleted successfully!")
                loadUsers()
            } else {
                toast.error(res.error || "Failed to delete user")
            }
        }
    }

    return (
        <div className="p-6 space-y-4 min-h-screen">
            <BackgroundDecor />
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">User Management</h2>
                    <p className="text-muted-foreground">Manage system access, roles, and user status.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="hover:bg-secondary bg-primary text-white" onClick={resetForm}>
                            <UserPlus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new user account with specific roles and permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" className="rounded-lg" placeholder="Enter full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" className="rounded-lg" placeholder="Enter department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" className="rounded-lg" placeholder="Enter email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password (Optional)</Label>
                                <Input id="password" type="password" className="rounded-lg" placeholder="Default password is Century123!" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" className="rounded-lg" placeholder="Enter phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={formData.role} onValueChange={val => setFormData({ ...formData, role: val })}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Agent">Agent</SelectItem>
                                            <SelectItem value="User">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="submit" disabled={loading} className="w-full rounded-full hover:bg-secondary bg-primary text-white">
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Create Account
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full bg-white rounded-lg">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users by name or email..."
                        className="pl-10 w-full rounded-lg border-slate-200 focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full md:w-[150px] rounded-lg bg-white">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-slate-500" />
                                <SelectValue placeholder="All Roles" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Agent">Agent</SelectItem>
                            <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[150px] rounded-lg bg-white">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-slate-500" />
                                <SelectValue placeholder="All Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Users Table */}
            <div className="border rounded-xl bg-white hover:shadow-sm transition-shadow overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                )}
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[300px] pl-12">User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="text-right pr-12">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    {loading ? "Loading users..." : "No users found matching your criteria."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-slate-50/50">
                                    <TableCell className="pl-10">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border border-slate-200 ring-1 ring-secondary-200">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                                <AvatarFallback className="bg-primary/5 text-primary font-normal">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-slate-900">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`rounded-md px-2.5 py-0.5 font-normal border-0 flex w-fit items-center gap-1.5 ${user.role === "Admin" ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200" :
                                            user.role === "Agent" ? "bg-blue-50 text-blue-700 font-normal ring-1 ring-blue-200" :
                                                "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                                            }`}>
                                            {user.role === "Admin" && <ShieldAlert className="h-3 w-3" />}
                                            {user.role === "Agent" && <ShieldCheck className="h-3 w-3" />}
                                            {user.role === "User" && <User className="h-3 w-3" />}
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' :
                                                user.status === 'Inactive' ? 'bg-slate-300' : 'bg-red-500'
                                                }`} />
                                            <span className="text-sm text-slate-600">{user.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        {user.department || "N/A"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {user.lastActive}
                                    </TableCell>
                                    <TableCell className="text-right pr-12">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4 text-primary/50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                                                <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                                    onClick={() => deactivateUser(user.id)}
                                                >
                                                    <Ban className="mr-2 h-4 w-4" /> Deactivate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" /> Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog (Reusing form structure) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit User Profile</DialogTitle>
                        <DialogDescription>
                            Update user details and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditUser} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input id="edit-name" className="rounded-xl" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-department">Department</Label>
                                <Input id="edit-department" className="rounded-xl" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" type="email" className="rounded-xl" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input id="edit-phone" className="rounded-xl" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select value={formData.role} onValueChange={val => setFormData({ ...formData, role: val })}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Agent">Agent</SelectItem>
                                        <SelectItem value="User">User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="submit" disabled={loading} className="w-full rounded-full hover:bg-secondary bg-primary text-white">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
