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

// CMS integration: import the full data layer
import { getCmsPageData } from "@/lib/cms";

export default async function Home() {
  // Fetch all CMS page data in parallel (falls back to hardcoded defaults if CMS unreachable)
  const { hero, about, services, process, portfolio, cta, footer } = await getCmsPageData();

  return (
    <LanguageProvider>
      <main className="flex-1">
        <ScrollProgress />
        <Navbar />
        <Hero hero={hero} />
        <About about={about} />
        <Services services={services} />
        <Process process={process} />
        <Portfolio portfolio={portfolio} />
        {/* Pass WhatsApp number from CMS, with env-var fallback */}
        <CTA whatsappNumber={cta.whatsappNumber} />
        <Footer footer={footer} />
      </main>
    </LanguageProvider>
  );
}
