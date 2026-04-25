"use client";

import { Monitor, Smartphone, Layers } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useLang } from "@/contexts/LanguageContext";

const t = {
  label: { en: "Services", id: "Layanan" },
  heading: { en: "What We Build", id: "Yang Kami Bangun" },
  sub: {
    en: "We specialize in three core areas to bring your digital products to life.",
    id: "Kami fokus di tiga area utama untuk mewujudkan produk digital Anda.",
  },
};

const services = {
  en: [
    { icon: Monitor, title: "Web App Development", description: "Modern, responsive web applications built with cutting-edge frameworks. From dashboards to complex platforms, we deliver performant solutions." },
    { icon: Smartphone, title: "Mobile App (Android)", description: "Native-quality Android applications using Flutter. Beautiful interfaces, smooth performance, and seamless user experiences on every device." },
    { icon: Layers, title: "SaaS Product", description: "End-to-end SaaS development from architecture to deployment. Scalable multi-tenant platforms with subscription management and analytics." },
  ],
  id: [
    { icon: Monitor, title: "Pengembangan Web App", description: "Aplikasi web modern dan responsif dengan framework terbaru. Dari dashboard hingga platform kompleks, kami membangun solusi yang performan." },
    { icon: Smartphone, title: "Mobile App (Android)", description: "Aplikasi Android berkualitas native menggunakan Flutter. Antarmuka indah, performa lancar, dan pengalaman pengguna yang mulus." },
    { icon: Layers, title: "Produk SaaS", description: "Pengembangan SaaS dari arsitektur hingga deployment. Platform multi-tenant yang scalable dengan manajemen langganan dan analytics." },
  ],
};

export default function Services() {
  const { lang } = useLang();

  return (
    <section id="services" className="relative py-24 md:py-32 bg-white dark:bg-[#0a0e1a]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-amber/5 rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-amber mb-4">{t.label[lang]}</span>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl lg:text-5xl">{t.heading[lang]}</h2>
            <p className="mt-4 text-brand-muted dark:text-white/50 text-lg">{t.sub[lang]}</p>
          </div>
        </AnimatedSection>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {services[lang].map((service, index) => {
            const Icon = service.icon;
            return (
              <AnimatedSection key={index} delay={index * 0.15}>
                <div className="glass-card rounded-3xl p-8 md:p-10 border-t-2 border-t-brand-amber h-full">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-amber/10">
                    <Icon className="w-7 h-7 text-brand-amber" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-3">{service.title}</h3>
                  <p className="text-brand-muted dark:text-white/50 leading-relaxed">{service.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
