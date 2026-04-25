"use client";

import { Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    quote:
      "Mereka ngerti visi kita dari awal, eksekusinya cepat, dan hasilnya langsung bisa kita pakai. Kalau ada project baru, pasti balik lagi ke sini.",
    name: "Andi P.",
    role: "Founder, FinPlan",
    initials: "AP",
  },
  {
    quote:
      "Timnya solid, komunikasinya enak. Ga ada drama, langsung dikerjain. App kita launch tepat waktu dan user response-nya positif.",
    name: "Sarah W.",
    role: "CEO, Nextra",
    initials: "SW",
  },
  {
    quote:
      "Udah coba beberapa vendor sebelumnya, tapi baru di bornworks prosesnya bener-bener smooth. Mereka juga proaktif kasih saran, bukan cuma nurut brief.",
    name: "Rizky H.",
    role: "CTO, CloudSync",
    initials: "RH",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-28 bg-brand-light dark:bg-[#0f1629]"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl">
              Kata Mereka
            </h2>
            <p className="mt-3 text-brand-muted dark:text-white/45 text-base">
              Feedback langsung dari klien yang sudah bekerja sama dengan kami.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((t, index) => (
            <AnimatedSection key={index} delay={index * 0.12}>
              <div className="glass-card rounded-2xl p-7 h-full flex flex-col">
                <Quote className="w-5 h-5 text-brand-amber/50 mb-4" strokeWidth={1.5} />

                <p className="text-brand-dark/75 dark:text-white/65 leading-relaxed flex-1 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-brand-dark/5 dark:border-white/5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark/5 dark:bg-white/10 text-brand-dark/60 dark:text-white/50 font-semibold text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-dark dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-brand-muted dark:text-white/35">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
