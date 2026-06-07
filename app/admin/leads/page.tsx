"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, UserPlus, Phone, Mail, Calendar, DollarSign, Loader2, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { getLeads, createLead, updateLead, deleteLead, type Lead } from "@/lib/backend/leads"
import { toast } from "sonner"

const stages = ["New", "Contacted", "Qualified", "Negotiation", "Closed"]

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

    // Add Form State
    const [newLead, setNewLead] = useState({
        name: "",
        email: "",
        phone: "",
        interest: "",
        budget: "",
        stage: "New" as Lead['stage'],
        source: "Website"
    })

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        interest: "",
        budget: "",
        stage: "New" as Lead['stage'],
        source: "Website"
    })

    // Load leads on mount
    useEffect(() => {
        const fetchAllLeads = async () => {
            setLoading(true)
            try {
                const data = await getLeads()
                setLeads(data)
            } catch (err: any) {
                console.error("Error loading leads", err)
                toast.error("Failed to load leads from database")
            } finally {
                setLoading(false)
            }
        }
        fetchAllLeads()
    }, [])

    // Populate Edit Form when a lead is selected
    useEffect(() => {
        if (selectedLead) {
            setEditForm({
                name: selectedLead.name,
                email: selectedLead.email || "",
                phone: selectedLead.phone,
                interest: selectedLead.interest,
                budget: selectedLead.budget || "",
                stage: selectedLead.stage,
                source: selectedLead.source || "Website"
            })
        }
    }, [selectedLead])

    const getLeadsByStage = (stage: string) => leads.filter(lead => lead.stage === stage)

    const handleAddLead = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const added = await createLead(newLead)
            setLeads(prev => [added, ...prev])
            setIsAddOpen(false)
            setNewLead({ name: "", email: "", phone: "", interest: "", budget: "", stage: "New", source: "Website" })
            toast.success("Lead created successfully")
        } catch (err: any) {
            console.error("Failed to add lead", err)
            toast.error("Error saving lead to database")
        }
    }

    const handleEditLead = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedLead) return

        try {
            const updated = await updateLead(selectedLead.id, editForm)
            setLeads(prev => prev.map(l => l.id === selectedLead.id ? updated : l))
            setIsEditOpen(false)
            setSelectedLead(null)
            toast.success("Lead updated successfully")
        } catch (err: any) {
            console.error("Failed to update lead", err)
            toast.error("Error saving updates to database")
        }
    }

    const handleDeleteLead = async (id: number) => {
        if (!confirm("Are you sure you want to delete this lead?")) return

        try {
            await deleteLead(id)
            setLeads(prev => prev.filter(l => l.id !== id))
            setIsEditOpen(false)
            setSelectedLead(null)
            toast.success("Lead deleted successfully")
        } catch (err: any) {
            console.error("Failed to delete lead", err)
            toast.error("Failed to delete lead from database")
        }
    }

    return (
        <div className="p-6 h-[850px] overflow-hidden flex flex-col space-y-4">
            <BackgroundDecor />

            {/* Header */}
            <div className="flex justify-between items-center z-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-third">Leads CRM</h2>
                    <p className="text-muted-foreground">Manage your sales pipeline and track potential clients.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="hover:bg-secondary rounded-xl shadow-md h-11 px-5 font-semibold transition-all">
                                <UserPlus className="mr-2 h-5 w-5" /> Add Lead
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Add New Lead</DialogTitle>
                                <DialogDescription>
                                    Enter the details of the potential client.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddLead} className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. John Doe"
                                        className="rounded-xl"
                                        required
                                        value={newLead.name}
                                        onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="rounded-xl"
                                            value={newLead.email}
                                            onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="e.g. 077 123 4567"
                                            className="rounded-xl"
                                            required
                                            value={newLead.phone}
                                            onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interest">Interested Property / Type</Label>
                                    <Input
                                        id="interest"
                                        placeholder="e.g. Luxury Villa in Colombo"
                                        className="rounded-xl"
                                        required
                                        value={newLead.interest}
                                        onChange={e => setNewLead({ ...newLead, interest: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Budget (LKR)</Label>
                                        <Input
                                            id="budget"
                                            placeholder="e.g. 50M"
                                            className="rounded-xl"
                                            value={newLead.budget}
                                            onChange={e => setNewLead({ ...newLead, budget: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="source">Source</Label>
                                        <Select
                                            value={newLead.source}
                                            onValueChange={val => setNewLead({ ...newLead, source: val })}
                                        >
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Select Source" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="Website">Website</SelectItem>
                                                <SelectItem value="Referral">Referral</SelectItem>
                                                <SelectItem value="Social Media">Social Media</SelectItem>
                                                <SelectItem value="Agent">Agent</SelectItem>
                                                <SelectItem value="Walk-in">Walk-in</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stage">Initial Stage</Label>
                                    <Select
                                        value={newLead.stage}
                                        onValueChange={val => setNewLead({ ...newLead, stage: val as Lead['stage'] })}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select Stage" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {stages.map(stage => (
                                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter className="pt-2">
                                    <Button type="submit" className="w-full rounded-full hover:bg-secondary">Add Lead</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Leads Edit Form Dialog (Triggered by 3 dotted lines click) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white">
                    <DialogHeader className="flex flex-row justify-between items-start">
                        <div>
                            <DialogTitle className="text-xl font-bold">Edit Lead Details</DialogTitle>
                            <DialogDescription>
                                Modify lead stages or customer information.
                            </DialogDescription>
                        </div>
                        {selectedLead && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full h-9 w-9 p-0 mr-6"
                                onClick={() => handleDeleteLead(selectedLead.id)}
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        )}
                    </DialogHeader>
                    <form onSubmit={handleEditLead} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input
                                id="edit-name"
                                required
                                className="rounded-xl"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email Address</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    className="rounded-xl"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone Number</Label>
                                <Input
                                    id="edit-phone"
                                    required
                                    className="rounded-xl"
                                    value={editForm.phone}
                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-interest">Interested Property / Type</Label>
                            <Input
                                id="edit-interest"
                                required
                                className="rounded-xl"
                                value={editForm.interest}
                                onChange={e => setEditForm({ ...editForm, interest: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-budget">Budget (LKR)</Label>
                                <Input
                                    id="edit-budget"
                                    className="rounded-xl"
                                    value={editForm.budget}
                                    onChange={e => setEditForm({ ...editForm, budget: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-source">Source</Label>
                                <Select
                                    value={editForm.source}
                                    onValueChange={val => setEditForm({ ...editForm, source: val })}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select Source" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="Website">Website</SelectItem>
                                        <SelectItem value="Referral">Referral</SelectItem>
                                        <SelectItem value="Social Media">Social Media</SelectItem>
                                        <SelectItem value="Agent">Agent</SelectItem>
                                        <SelectItem value="Walk-in">Walk-in</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-stage">Lead Stage (Category)</Label>
                            <Select
                                value={editForm.stage}
                                onValueChange={val => setEditForm({ ...editForm, stage: val as Lead['stage'] })}
                            >
                                <SelectTrigger className="rounded-xl border-secondary">
                                    <SelectValue placeholder="Select Stage" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {stages.map(stage => (
                                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Kanban Board */}
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="h-10 w-10 animate-spin text-secondary" />
                    <p className="text-sm font-semibold text-slate-500">Loading Leads CRM Database...</p>
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto z-10">
                    <div className="flex gap-4 h-full min-w-[1200px]">
                        {stages.map((stage) => (
                            <div key={stage} className="flex-1 flex flex-col bg-slate-50/80 rounded-xl border border-slate-200/60 p-3">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                                        {stage}
                                    </h3>
                                    <Badge variant="secondary" className="rounded-full bg-white shadow-sm text-slate-600 font-mono font-bold">
                                        {getLeadsByStage(stage).length}
                                    </Badge>
                                </div>

                                {/* Cards Container */}
                                <ScrollArea className="flex-1 -mx-2 px-2">
                                    <div className="space-y-3 pb-2">
                                        {getLeadsByStage(stage).map((lead) => (
                                            <Card 
                                                key={lead.id} 
                                                className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-secondary group relative"
                                            >
                                                <CardContent className="p-3">
                                                    {/* Header: Name + Action dots */}
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                                                    {lead.name.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-semibold text-sm text-slate-800">{lead.name}</span>
                                                        </div>
                                                        
                                                        {/* Edit Action Button (3 dotted lines) */}
                                                        <Button 
                                                            variant="ghost" 
                                                            className="h-6 w-6 p-0 rounded-full hover:bg-slate-100 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation() // Stop card click
                                                                setSelectedLead(lead)
                                                                setIsEditOpen(true)
                                                            }}
                                                        >
                                                            <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" />
                                                        </Button>
                                                    </div>

                                                    {/* Interest */}
                                                    <div className="text-xs font-semibold text-slate-600 mb-2 truncate">
                                                        {lead.interest}
                                                    </div>

                                                    {/* Details Grid */}
                                                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-slate-500 mb-2">
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="h-3 w-3 text-secondary" />
                                                            {lead.budget || "N/A"}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-secondary" />
                                                            {lead.date || "Today"}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3 text-secondary" />
                                                            {lead.phone}
                                                        </div>
                                                        {lead.email && (
                                                            <div className="flex items-center gap-1 truncate" title={lead.email}>
                                                                <Mail className="h-3 w-3 text-secondary" />
                                                                {lead.email}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer Tags */}
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        <Badge variant="outline" className="text-[9px] h-4.5 px-1.5 font-normal bg-slate-50 border-slate-200">
                                                            {lead.source || "Website"}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        {getLeadsByStage(stage).length === 0 && (
                                            <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">
                                                No leads in {stage}
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
