"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PropertyDescriptionProps {
    description: string
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const isLong = description.length > 400

    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Description</h2>

            <div className="relative">
                <div
                    className={`text-muted-foreground text-sm leading-relaxed whitespace-pre-line transition-all duration-500 ${!isExpanded && isLong ? "max-h-[120px] overflow-hidden" : ""
                        }`}
                >
                    {description}
                </div>

                {/* Fade overlay when collapsed 
                {!isExpanded && isLong && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
                )}*/}
            </div>

            {isLong && (
                <Button
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-secondary hover:text-secondary/80 text-sm font-medium gap-1 px-0 h-auto"
                >
                    {isExpanded ? (
                        <>Read Less <ChevronUp className="h-4 w-4" /></>
                    ) : (
                        <>Read More <ChevronDown className="h-4 w-4" /></>
                    )}
                </Button>
            )}
        </div>
    )
}
