import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function AboutHero() {
    return (
        <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/mock/12.jpg"
                    alt="Luxury Home Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                    Building Dreams, <br />
                    <span className="text-accent">Delivering Homes</span>
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Your trusted partner in finding the perfect property. We specialize in luxury homes, land sales, and investment opportunities across Sri Lanka.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in zoom-in duration-700 delay-200">
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary hover:bg-secondary text-white rounded-full px-8 h-12 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        <Link href="/properties">
                            View Properties <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="bg-white/10 hover:bg-white text-white hover:text-primary border-white/30 backdrop-blur-sm rounded-full px-8 h-12 text-base font-semibold hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
