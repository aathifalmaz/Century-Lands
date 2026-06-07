import { SearchFilter } from "@/components/SearchFilter"

export function Hero() {
    return (
        <section className="relative min-h-[100vh] w-full flex flex-col justify-center items-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    /*backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",*/
                    backgroundImage: "url('/mock/12.jpg')",
                    /*backgroundImage: "url('https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?q=80&w=1181&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",*/
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center gap-8 text-center pt-20">
                <div className="space-y-4 max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-md">
                        Find Your Dream Property <br />
                        <span className="text-accent">in Sri Lanka</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto drop-shadow-sm">
                        Explore verified lands, houses, and apartments with Century Lands & Homes <br /> Your trusted real estate partner.
                    </p>
                </div>

                {/* Search Filter Card */}
                <div >
                    <SearchFilter />
                </div>

            </div>
        </section>
    )
}
