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

export default function Home() {
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
        <CTA whatsappNumber={process.env.WHATSAPP_NO} />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
