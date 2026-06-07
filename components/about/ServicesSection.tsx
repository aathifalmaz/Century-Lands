import { Home, Key, Building2, TrendingUp } from "lucide-react"

export function ServicesSection() {
    const services = [
        {
            icon: Home,
            title: "Buying Property",
            desc: "Expert guidance to find your dream home or ideal investment plot with ease."
        },
        {
            icon: Key,
            title: "Selling Property",
            desc: "We help you get the best market value for your property with our vast network."
        },
        {
            icon: Building2,
            title: "Property Management",
            desc: "Comprehensive management services for landlords, including maintenance and rentals."
        },
        {
            icon: TrendingUp,
            title: "Investment Consulting",
            desc: "Strategic advice on high-growth real estate opportunities across the island."
        },
    ]

    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-secondary font-bold text-sm tracking-uppercase mb-2 block">OUR SERVICES</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Comprehensive Real Estate Solutions</h2>
                    <p className="text-muted-foreground">Whether you're buying your first home, selling a plot, or looking for property management, we have you covered.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((item) => (
                        <div key={item.title} className="group p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 hover:border-secondary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
