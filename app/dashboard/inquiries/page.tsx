"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockUser } from "@/data/mockUser"
import { MessageSquare, Clock, Search, Reply, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { getInquiriesByEmail, updateInquiryReply } from "@/lib/backend/inquiries"
import { toast } from "sonner"

export default function InquiriesPage() {
    const [user, setUser] = useState<any>(null)
    const [inquiries, setInquiries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Reply states
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
    const [replyText, setReplyText] = useState("")
    const [submittingReply, setSubmittingReply] = useState(false)

    const fetchUserAndInquiries = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const loggedInUser = session?.user ?? null
            setUser(loggedInUser)

            if (loggedInUser && loggedInUser.email) {
                const data = await getInquiriesByEmail(loggedInUser.email)
                setInquiries(data)
            }
        } catch (error) {
            console.error("Error loading inquiries:", error)
            toast.error("Failed to load inquiries.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserAndInquiries()
    }, [])

    const handleSendReply = async (inquiryId: number) => {
        if (!replyText.trim()) return

        setSubmittingReply(true)
        try {
            await updateInquiryReply(inquiryId, replyText.trim())
            toast.success("Reply sent successfully!")
            setReplyText("")
            setActiveReplyId(null)
            fetchUserAndInquiries() // reload list
        } catch (error) {
            toast.error("Failed to send reply.")
        } finally {
            setSubmittingReply(false)
        }
    }

    const filteredInquiries = inquiries.filter(i =>
        (i.property_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.message || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-third">Inquiries</h1>
                    <p className="text-muted-foreground mt-1">Track your messages and property requests.</p>
                </div>
                <div className="relative w-full sm:w-auto rounded-lg border border-border bg-white">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search inquiries..."
                        className="pl-9 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="border-border/60 shadow-sm hover:shadow-md bg-white rounded-2xl overflow-hidden transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/40 bg-gray-50/50 py-5 px-6">
                            <div className="flex items-center gap-4">
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border bg-white flex items-center justify-center shadow-sm">
                                    <MessageSquare className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary text-base">{inquiry.property_title}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        Submitted on {new Date(inquiry.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={inquiry.status === "Replied" ? "default" : inquiry.status === "Pending" ? "secondary" : "outline"} className="h-6 px-3 rounded-full text-xs font-semibold">
                                {inquiry.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
                                <div className="flex gap-3">
                                    <Avatar className="h-9 w-9 border border-border shadow-sm">
                                        <AvatarImage src={mockUser.avatar} />
                                        <AvatarFallback>ME</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-semibold text-gray-900">You</p>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {new Date(inquiry.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                                    </div>
                                </div>

                                {inquiry.reply && (
                                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex gap-3 animate-in fade-in duration-300">
                                        <Avatar className="h-9 w-9 border border-border shadow-sm">
                                            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">A</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-semibold text-emerald-700">Support Agent</p>
                                                <span className="text-xs text-muted-foreground font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">Agent</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{inquiry.reply}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Active reply input overlay */}
                            {activeReplyId === inquiry.id && (
                                <div className="mt-4 p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl space-y-3 animate-in slide-in-from-top duration-300">
                                    <Label className="text-sm font-semibold text-primary">Your Follow-up Reply</Label>
                                    <Textarea
                                        placeholder="Type your response to the agent here..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="rounded-xl h-24 focus-visible:ring-emerald-500 bg-white border-slate-200 focus:border-emerald-500"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => { setActiveReplyId(null); setReplyText("") }}
                                            className="rounded-xl h-9"
                                            disabled={submittingReply}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSendReply(inquiry.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-4 font-semibold"
                                            disabled={submittingReply || !replyText.trim()}
                                        >
                                            {submittingReply ? "Sending..." : "Send Reply"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Action Footer */}
                            {activeReplyId !== inquiry.id && (
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setActiveReplyId(inquiry.id)
                                            setReplyText(inquiry.reply ? `Regarding: "${inquiry.reply.substring(0, 30)}..."\n` : "")
                                        }}
                                        className="h-9 px-4 text-xs font-semibold rounded-xl gap-2 bg-primary text-white hover:bg-secondary active:scale-[0.98] transition-all"
                                    >
                                        <Reply className="h-3.5 w-3.5" />
                                        Reply / Follow-up
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {filteredInquiries.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No inquiries found</h3>
                        <p className="text-gray-500 text-sm mt-1">Submit inquiries on properties to view them here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
