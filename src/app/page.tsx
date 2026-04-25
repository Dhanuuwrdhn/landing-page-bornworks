import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import TechStack from "@/components/TechStack";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingControls from "@/components/FloatingControls";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="flex-1">
        <ScrollProgress />
        <Navbar />
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <TechStack />
        <Testimonials />
        <WhyUs />
        <CTA />
        <Footer />
        <FloatingWhatsApp />
        <FloatingControls />
      </main>
    </LanguageProvider>
  );
}
