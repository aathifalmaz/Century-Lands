import { Target, Lightbulb, Heart } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BackgroundDecor } from "@/components/BackgroundDecor";

export function MissionVision() {
    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

                {/* Mission */}
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold text-primary">Our Mission</CardTitle>
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target className="h-5 w-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed mt-2">
                            To deliver high-value properties with trust, transparency, and integrity, ensuring every client finds a place they can truly call home.
                        </p>
                    </CardContent>
                </Card>

                {/* Vision */}
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">

                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold text-primary">Our Vision</CardTitle>
                        <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Lightbulb className="h-5 w-5 text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed mt-2">
                            To become Sri Lanka's most trusted and innovative real estate brand, setting new benchmarks for service excellence and customer satisfaction.
                        </p>
                    </CardContent>
                </Card>

                {/* Values */}
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold text-primary">Our Values</CardTitle>
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Heart className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-muted-foreground mt-2">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> Transparency in every deal
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> Customer-first approach
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> Integrity & Honesty
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> Continuous Innovation
                            </li>
                        </ul>
                    </CardContent>
                </Card>

            </div>
        </section>
    )
}
