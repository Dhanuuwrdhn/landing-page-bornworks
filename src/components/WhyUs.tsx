"use client";

import { Zap, ShieldCheck, MessageCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useLang } from "@/contexts/LanguageContext";

const t = {
  label: { en: "Why Us", id: "Kenapa Kami" },
  heading: { en: "Why Teams Choose Us", id: "Kenapa Tim Memilih Kami" },
  sub: {
    en: "Building products is hard. We make the process easier.",
    id: "Membangun produk itu sulit. Kami membuat prosesnya lebih mudah.",
  },
};

const features = {
  en: [
    { icon: Zap, title: "Startup Mindset", description: "We move fast and iterate quickly. No corporate bureaucracy — just focused execution to get your product to market." },
    { icon: ShieldCheck, title: "Full Ownership", description: "You own 100% of the code, design, and IP. We build it, you own it — no lock-in, no hidden dependencies." },
    { icon: MessageCircle, title: "Honest Communication", description: "Transparent progress updates, realistic timelines, and direct feedback. We tell you what you need to hear, not what you want to hear." },
  ],
  id: [
    { icon: Zap, title: "Mindset Startup", description: "Kami bergerak cepat dan iterasi dengan sigap. Tanpa birokrasi — langsung eksekusi untuk membawa produk Anda ke pasar." },
    { icon: ShieldCheck, title: "Kepemilikan Penuh", description: "Anda memiliki 100% kode, desain, dan hak kekayaan intelektual. Kami membangun, Anda yang memiliki — tanpa lock-in." },
    { icon: MessageCircle, title: "Komunikasi Jujur", description: "Update progres transparan, timeline realistis, dan feedback langsung. Kami sampaikan yang perlu didengar, bukan yang ingin didengar." },
  ],
};

export default function WhyUs() {
  const { lang } = useLang();

  return (
    <section id="about" className="relative py-24 md:py-32 bg-brand-light dark:bg-[#0f1629]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-amber/5 rounded-full blur-3xl" />
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
          {features[lang].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={index} delay={index * 0.15}>
                <div className="glass-card rounded-3xl p-8 md:p-10 h-full">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-amber/10">
                    <Icon className="w-7 h-7 text-brand-amber" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-brand-muted dark:text-white/50 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
