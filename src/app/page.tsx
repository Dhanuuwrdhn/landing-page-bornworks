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

export default function Home() {
  return (
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
    </main>
  );
}
