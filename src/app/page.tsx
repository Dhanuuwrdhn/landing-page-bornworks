import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

// CMS integration: import the data layer
import { getCta } from "@/lib/cms";

export default async function Home() {
  // Fetch CTA from CMS (falls back to hardcoded defaults if CMS unreachable)
  const ctaData = await getCta();

  return (
    <LanguageProvider>
      <main className="flex-1">
        <ScrollProgress />
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Process />
        <Portfolio />
        {/* Pass WhatsApp number from CMS, with env-var fallback */}
        <CTA whatsappNumber={ctaData.whatsappNumber} />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
