import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AboutHero } from "@/components/about/AboutHero"
import { CompanyIntro } from "@/components/about/CompanyIntro"
import { MissionVision } from "@/components/about/MissionVision"
import { WhyChooseUsSection } from "@/components/about/WhyChooseUsSection"
import { StatsSection } from "@/components/about/StatsSection"
import { ServicesSection } from "@/components/about/ServicesSection"
import { ContactInfo } from "@/components/about/ContactInfo"
import { AboutCTA } from "@/components/about/AboutCTA"
import { BackgroundDecor } from "@/components/BackgroundDecor";

import { isSupabaseConfigured } from "@/lib/supabase"
import { getHomeStats } from "@/lib/backend/properties"

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
    let stats = {
        soldPropertiesCount: 0,
        clientsCount: 0,
        citiesCount: 0
    }

    if (isSupabaseConfigured) {
        try {
            const homeStats = await getHomeStats()
            stats = {
                soldPropertiesCount: homeStats.soldPropertiesCount,
                clientsCount: homeStats.clientsCount,
                citiesCount: homeStats.citiesCount
            }
        } catch (error) {
            console.error('Error fetching about page stats:', error)
        }
    }

    return (
        <main className="min-h-screen relative z-10">
            <Navbar forceScrolled />

            <BackgroundDecor />
            <AboutHero />
            <CompanyIntro />
            <MissionVision />
            <WhyChooseUsSection />
            <StatsSection stats={stats} />
            <ServicesSection />
            <ContactInfo />
            <AboutCTA />

            <Footer />
        </main>
    )
}
