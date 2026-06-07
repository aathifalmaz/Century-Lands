import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AboutCTA() {
    return (
        <section className="py-20 px-4 bg-primary text-white text-center">
            <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">Find Your Dream Property Today</h2>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
                    Ready to take the next step? Browse our exclusive listings or speak to one of our expert agents.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        asChild
                        size="lg"
                        className="bg-secondary hover:bg-white hover:text-primary text-white rounded-full px-8 h-12 text-base font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                        <Link href="/properties">View Listings</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-white text-white hover:bg-white hover:text-primary rounded-full px-8 h-12 text-base font-semibold hover:scale-105 transition-all"
                    >
                        <Link href="/contact">Contact Agent</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
