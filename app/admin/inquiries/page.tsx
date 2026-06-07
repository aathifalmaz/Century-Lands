"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, MessageSquare, Archive, Reply } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getInquiries, updateInquiryStatus, type Inquiry } from "@/lib/backend/inquiries"
import { toast } from "sonner"

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchInquiries()
    }, [])

    async function fetchInquiries() {
        try {
            const data = await getInquiries()
            setInquiries(data)
            if (data && data.length > 0 && !selectedId) {
                setSelectedId(data[0].id)
            }
        } catch (error) {
            toast.error("Failed to fetch inquiries")
        }
    }

    const filteredInquiries = inquiries.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.property_title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedInquiry = inquiries.find(i => i.id === selectedId)

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await updateInquiryStatus(id, status)
            fetchInquiries()
        } catch (error) {
            toast.error("Update failed")
        }
    }

    return (
        <div className="flex h-[calc(100vh-65px)]">
            {/* List Sidebar */}
            <div className="w-1/3 border-r bg-white flex flex-col">
                <div className="p-4 border-b space-y-4">
                    <h2 className="text-xl font-bold">Inquiries</h2>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search messages..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    {filteredInquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedId === inquiry.id ? "bg-muted" : ""}`}
                            onClick={() => setSelectedId(inquiry.id)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm font-semibold ${inquiry.status === "New" ? "text-primary" : ""}`}>
                                    {inquiry.name}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(inquiry.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm font-medium truncate mb-1">{inquiry.property_title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{inquiry.message}</p>
                            <Badge variant={inquiry.status === "New" ? "default" : "secondary"} className="mt-2 text-[10px] h-5">
                                {inquiry.status}
                            </Badge>
                        </div>
                    ))}
                    {filteredInquiries.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">No inquiries found.</div>
                    )}
                </div>
            </div>

            {/* Detail View */}
            <div className="flex-1 bg-gray-50/50 p-8 flex flex-col">
                {selectedInquiry ? (
                    <Card className="flex-1 flex flex-col shadow-none border-0 bg-transparent">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedInquiry.property_title}</h2>
                                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">{selectedInquiry.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">{selectedInquiry.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => handleStatusUpdate(selectedInquiry.id, 'Archived')}>
                                    <Archive className="h-4 w-4 mr-2" /> Archive
                                </Button>
                                <Button onClick={() => handleStatusUpdate(selectedInquiry.id, 'Replied')}>
                                    <Reply className="h-4 w-4 mr-2" /> Mark as Replied
                                </Button>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex-1 py-6">
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <p className="text-sm text-muted-foreground mb-4">
                                    From: <span className="font-semibold text-foreground">{selectedInquiry.name}</span> on {new Date(selectedInquiry.created_at).toLocaleString()}
                                </p>
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {selectedInquiry.message}
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select an inquiry to view details</p>
                    </div>
                )}
            </div>
        </div>
    )
}
