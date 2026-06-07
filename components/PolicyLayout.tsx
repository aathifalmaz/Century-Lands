import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BackgroundDecor } from "@/components/BackgroundDecor"

interface PolicyLayoutProps {
    title: string
    subtitle: string
    children: React.ReactNode
}

export function PolicyLayout({ title, subtitle, children }: PolicyLayoutProps) {
    return (
        <main className="min-h-screen relative z-10">
            <Navbar forceScrolled />
            <BackgroundDecor />

            {/* Hero */}
            <section className="pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">{title}</h1>
                    <p className="text-muted-foreground text-lg">{subtitle}</p>
                </div>
            </section>

            {/* Content */}
            <section className="px-4 pb-20">
                <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-8 md:p-12
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-10 [&_h2]:mb-4
                    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-6 [&_h3]:mb-2
                    [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                    [&_li]:text-muted-foreground [&_li]:leading-relaxed
                    [&_strong]:text-foreground [&_strong]:font-semibold
                    [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary
                ">
                    {children}
                </div>
            </section>

            <Footer />
        </main>
    )
}
