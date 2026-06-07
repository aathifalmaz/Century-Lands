import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ContactHero } from "@/components/contact/ContactHero"
import { ContactForm } from "@/components/contact/ContactForm"
import { ContactInfo } from "@/components/about/ContactInfo"
import { BackgroundDecor } from "@/components/BackgroundDecor"

export default function ContactPage() {
    return (
        <main className="min-h-screen relative z-10">
            <Navbar forceScrolled />
            <BackgroundDecor />

            <ContactHero />

            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-20">
                {/* Reused Contact Info Section */}
                {/* Note: ContactInfo component has its own section wrapper with padding. 
                    We might want to vertically stack it or just let it be. 
                    Ideally, we'd render it directly. */}
                <ContactInfo />

                {/* Contact Form Section */}
                <section className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <h2 className="text-3xl font-bold text-primary">Have a specific inquiry?</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Fill out the form and our team will get in touch with you shortly.
                            Whether you're looking to buy, sell, or just need some advice, we're here for you.
                        </p>
                        <div className="p-6 bg-secondary/10 rounded-2xl border border-secondary/20">
                            <h3 className="font-bold text-secondary mb-2">Office Hours</h3>
                            <p className="text-foreground/80">
                                Mon - Fri: 9:00 AM - 5:00 PM<br />
                                Sat: 9:00 AM - 1:00 PM<br />
                                Sun: Closed
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <ContactForm />
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    )
}
