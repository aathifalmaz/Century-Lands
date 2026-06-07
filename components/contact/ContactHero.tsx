export function ContactHero() {
    return (
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
                    alt="Contact Century Lands"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Get in Touch
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    We're here to help you find your perfect property. Reach out to us for any inquiries or to schedule a visit.
                </p>
            </div>
        </section>
    )
}
