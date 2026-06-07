import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
    const email = "centurylandshomes@gmail.com"

    return (
        <section className="pt-4 pb-12 px-4 md:px-8 bg-muted/20">
            <div className="max-w-4xl mx-auto">
                {/* Contact Details */}
                <div className="space-y-12 text-center flex flex-col items-center">
                    <div>
                        <span className="text-secondary font-bold text-sm tracking-uppercase mb-2 block">GET IN TOUCH</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Visit Our Office</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We'd love to meet you in person. Drop by our Kandy office for a cup of tea
                            and a chat about your property needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {/* Address */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-foreground text-lg">Address</h3>
                            <p className="text-muted-foreground mt-2 leading-relaxed">
                                135/3/10, 3rd Floor, Nabeesha Complex,<br />
                                Kotugodalla Street, Kandy
                            </p>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-foreground text-lg">Phone</h3>
                            <div className="text-muted-foreground mt-2 space-y-1">
                                <p className="font-semibold text-foreground/80">070 722 0224</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-foreground text-lg">Email</h3>
                            <p className="text-muted-foreground mt-2 font-semibold text-foreground/80">{email}</p>
                        </div>

                        {/* Opening Hours */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-foreground text-lg">Opening Hours</h3>
                            <p className="text-muted-foreground mt-2 leading-relaxed">
                                <span className="block italic">Monday - Friday:</span>
                                <span className="font-semibold text-foreground/80">9:00 AM - 5:00 PM</span>
                                <span className="block italic mt-1">Saturday:</span>
                                <span className="font-semibold text-foreground/80">9:00 AM - 1:00 PM</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
