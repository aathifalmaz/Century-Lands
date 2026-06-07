import { ShieldCheck, Scale, Banknote, Map, CheckCircle, Clock } from "lucide-react"

export function WhyChooseUsSection() {
    const reasons = [
        {
            icon: ShieldCheck,
            title: "Verified Properties",
            desc: "Every listing is thoroughly vetted for legal clarity and clear deeds."
        },
        {
            icon: Scale,
            title: "Legal Assistance",
            desc: "We provide comprehensive legal support to ensure a smooth transaction."
        },
        {
            icon: Banknote,
            title: "Bank Loan Support",
            desc: "Our team assists with necessary documentation for fast loan approvals."
        },
        {
            icon: Map,
            title: "Guided Site Visits",
            desc: "We arrange transportation and expert guides for property inspections."
        },
        {
            icon: CheckCircle,
            title: "Transparent Process",
            desc: "No hidden fees or surprises. You know exactly what you're paying for."
        },
        {
            icon: Clock,
            title: "After-Sales Service",
            desc: "Support doesn't end at the sale. We help with transfers and more."
        },
    ]

    return (
        <section className="py-20 px-4 md:px-8 bg-primary text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-secondary font-bold text-sm tracking-uppercase mb-2 block">WHY CHOOSE US</span>
                    <h2 className="text-3xl md:text-4xl font-bold">Your Peace of Mind is Our Priority</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((item) => (
                        <div key={item.title} className="flex gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="shrink-0 h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
