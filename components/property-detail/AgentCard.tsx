import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MessageCircle, ArrowRight } from "lucide-react"

interface AgentCardProps {
    agent: {
        name: string
        company: string
        phone: string
        email: string
        whatsapp: string
        photo: string
    }
}

export function AgentCard({ agent }: AgentCardProps) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Listing Agent</h2>

            <Card className="border-border/40 bg-white/60 dark:bg-white/5 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        {/* Agent Photo */}
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-secondary/30 shrink-0">
                            <Image
                                src={agent.photo}
                                alt={agent.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Agent Info */}
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-foreground">{agent.name}</h3>
                            <p className="text-sm text-muted-foreground">{agent.company}</p>
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">
                        <Button
                            variant="outline"
                            asChild
                            className="rounded-xl h-10 gap-2 border-border/60 hover:border-secondary hover:text-secondary text-sm transition-all"
                        >
                            <a href={`tel:${agent.phone}`}>
                                <Phone className="h-4 w-4" />
                                Call
                            </a>
                        </Button>

                        <Button
                            variant="outline"
                            asChild
                            className="rounded-xl h-10 gap-2 border-border/60 hover:border-primary hover:text-primary text-sm transition-all"
                        >
                            <a href={`mailto:${agent.email}`}>
                                <Mail className="h-4 w-4" />
                                Email
                            </a>
                        </Button>

                        <Button
                            variant="outline"
                            asChild
                            className="rounded-xl h-10 gap-2 border-border/60 hover:border-green-600 hover:text-green-600 text-sm transition-all"
                        >
                            <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full mt-3 text-secondary hover:text-secondary/80 text-sm gap-1 h-auto py-2"
                    >
                        View all listings <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
