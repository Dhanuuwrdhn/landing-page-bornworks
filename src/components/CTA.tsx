"use client";

import { ArrowRight, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { useLang } from "@/contexts/LanguageContext";

const t = {
  heading: { en: "Ready to Build Something Great?", id: "Siap Membangun Sesuatu yang Besar?" },
  sub: { en: "Let\u2019s turn your idea into a product people love.", id: "Mari wujudkan ide Anda menjadi produk yang disukai banyak orang." },
  cta: { en: "Let\u2019s Talk", id: "Hubungi Kami" },
};

export default function CTA() {
  const { lang } = useLang();

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-white dark:bg-[#0a0e1a]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-amber/8 rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="glass rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden amber-glow">
            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-8 right-8 hidden md:block">
              <div className="w-12 h-12 rounded-2xl bg-brand-amber/10 flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-brand-amber/40" strokeWidth={2} />
              </div>
            </motion.div>
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-brand-amber/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-brand-amber/8 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl lg:text-5xl max-w-2xl mx-auto">{t.heading[lang]}</h2>
              <p className="mt-4 text-lg text-brand-muted dark:text-white/50 max-w-xl mx-auto">{t.sub[lang]}</p>
              <div className="mt-10">
                <a href="mailto:hello@bornworks.id" id="cta-lets-talk" className="group inline-flex items-center gap-3 rounded-2xl bg-brand-amber px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-brand-amber/30 hover:bg-brand-amber-dark hover:shadow-brand-amber/50 transition-all duration-300">
                  {t.cta[lang]}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
