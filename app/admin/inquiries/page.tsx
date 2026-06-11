"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, MessageSquare, Archive, Reply, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getInquiries, updateInquiryStatus, type Inquiry } from "@/lib/backend/inquiries"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 10

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [mobileView, setMobileView] = useState<"list" | "detail">("list")

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

    // Pagination
    const totalPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE)
    const paginatedInquiries = filteredInquiries.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    const selectedInquiry = inquiries.find(i => i.id === selectedId)

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await updateInquiryStatus(id, status)
            fetchInquiries()
        } catch (error) {
            toast.error("Update failed")
        }
    }

    const handleSelectInquiry = (id: number) => {
        setSelectedId(id)
        setMobileView("detail")
    }

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-65px)]">
            {/* List Sidebar - hidden on mobile when viewing detail */}
            <div className={`w-full md:w-1/3 border-r bg-white flex flex-col ${mobileView === "detail" ? "hidden md:flex" : "flex"}`}>
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
                    {paginatedInquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedId === inquiry.id ? "bg-muted" : ""}`}
                            onClick={() => handleSelectInquiry(inquiry.id)}
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
                    {paginatedInquiries.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">No inquiries found.</div>
                    )}
                </div>
                {/* Pagination in sidebar */}
                {totalPages > 1 && (
                    <div className="p-3 border-t flex items-center justify-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-7 w-7 p-0"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-xs text-muted-foreground px-2">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-7 w-7 p-0"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Detail View */}
            <div className={`flex-1 bg-gray-50/50 flex flex-col ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
                {selectedInquiry ? (
                    <div className="flex-1 flex flex-col p-4 sm:p-8">
                        {/* Mobile back button */}
                        <Button
                            variant="ghost"
                            className="md:hidden mb-3 self-start -ml-2 gap-1 text-muted-foreground h-8"
                            onClick={() => setMobileView("list")}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to list
                        </Button>

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div className="min-w-0">
                                <h2 className="text-xl sm:text-2xl font-bold truncate">{selectedInquiry.property_title}</h2>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4 shrink-0" />
                                        <span className="text-sm truncate">{selectedInquiry.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        <span className="text-sm">{selectedInquiry.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => handleStatusUpdate(selectedInquiry.id, 'Archived')}>
                                    <Archive className="h-4 w-4 mr-2" /> Archive
                                </Button>
                                <Button className="flex-1 sm:flex-none" onClick={() => handleStatusUpdate(selectedInquiry.id, 'Replied')}>
                                    <Reply className="h-4 w-4 mr-2" /> Mark as Replied
                                </Button>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex-1 py-6">
                            <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
                                <p className="text-sm text-muted-foreground mb-4">
                                    From: <span className="font-semibold text-foreground">{selectedInquiry.name}</span> on {new Date(selectedInquiry.created_at).toLocaleString()}
                                </p>
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {selectedInquiry.message}
                                </p>
                            </div>
                        </div>
                    </div>
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
