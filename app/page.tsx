import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsStrip } from "@/components/StatsStrip";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { isSupabaseConfigured } from "@/lib/supabase"
import { getFeaturedProperties, getHomeStats } from "@/lib/backend/properties"
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { Testimonials } from "@/components/Testimonials";

export const dynamic = 'force-dynamic'

export default async function Home() {
  let propertiesData: any[] = []
  let homeStats = {
    propertiesCount: 0,
    citiesCount: 0,
    clientsCount: 0
  }

  if (isSupabaseConfigured) {
    try {
      const [featProps, stats] = await Promise.all([
        getFeaturedProperties(8),
        getHomeStats()
      ])
      propertiesData = featProps
      homeStats = stats
    } catch (error: any) {
      console.error('Error fetching home data:', error)
    }
  }

  const formattedProperties = propertiesData.map((p: any) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    beds: p.beds,
    baths: p.baths,
    size: p.size,
    image: p.image || "/mock/1.jpg"
  }))

  return (
    <main className="min-h-screen flex flex-col relative">
      <BackgroundDecor />
      <Navbar />

      <Hero />

      <ScrollReveal delay={0.1}>
        <StatsStrip stats={homeStats} />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <FeaturedProperties properties={formattedProperties} />
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <WhyChooseUs />
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <CallToAction />
      </ScrollReveal>

      <Footer />
    </main>
  );
}
