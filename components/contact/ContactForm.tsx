"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

import { createInquiry } from "@/lib/backend/inquiries"
import { toast } from "sonner"

export function ContactForm() {
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const subject = formData.get('subject') as string
        const message = formData.get('message') as string

        setIsSubmitting(true)
        try {
            await createInquiry({
                name,
                email,
                phone: "", // Subject can be included in message or added to schema
                property_title: `General Inquiry: ${subject}`,
                message,
            })
            setSubmitted(true)
        } catch (error) {
            console.error('Contact error:', error)
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-2 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
                <p className="text-muted-foreground max-w-xs">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button
                    variant="outline"
                    className="mt-8"
                    onClick={() => setSubmitted(false)}
                >
                    Send Another Message
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
            <div className="mb-8">
                <span className="text-secondary font-bold text-sm tracking-uppercase mb-2 block">SEND A MESSAGE</span>
                <h2 className="text-2xl md:text-3xl font-bold text-primary">How Can We Help?</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required className="bg-white/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-white/50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" placeholder="Inquiry about..." required className="bg-white/50" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your property needs..."
                        className="min-h-[80px] resize-none bg-white/50"
                        required
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full bg-primary hover:bg-secondary text-white font-semibold h-12 rounded-xl transition-all shadow-lg hover:shadow-xl">
                    {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
            </form>
        </div>
    )
}
