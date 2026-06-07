import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export function CompanyIntro() {
    const specialties = [
        "Land Sales & Development",
        "Luxury House Listings",
        "Investment Consulting",
        "Property Management",
    ]

    return (
        <section className="py-20 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Image Grid */}
                <div className="relative">
                    <div className="aspect-[5/4] relative rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/mock/1.jpg"
                            alt="Modern Architecture"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white p-6 rounded-xl shadow-xl border border-border/10 max-w-[200px]">
                        <p className="text-4xl font-bold text-primary">10+</p>
                        <p className="text-sm text-muted-foreground font-medium">Years of Excellence in Real Estate</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div>
                        <span className="text-secondary font-bold text-sm tracking-uppercase mb-2 block">WHO WE ARE</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                            Your Trusted Partner in <br /> Sri Lankan Real Estate
                        </h2>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        Established with a vision to redefine the real estate experience in Sri Lanka, Century Lands & Homes has grown to become a leading name in the property sector. We operate primarily in the Central and Western provinces, specializing in connecting clients with their dream properties.
                    </p>

                    <p className="text-muted-foreground leading-relaxed">
                        Whether you are looking for a luxury villa in Kandy, a commercial plot in Colombo, or a quiet retirement home in the hills, our expert team is dedicated to guiding you through every step of the journey.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                        {specialties.map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                                <span className="font-medium text-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
