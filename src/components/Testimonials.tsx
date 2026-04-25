"use client";

import { Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    quote:
      "bornworks delivered exactly what we needed — a clean, scalable app that our users love. Their communication throughout was excellent.",
    name: "Andi Prasetyo",
    role: "Founder, FinPlan App",
    initials: "AP",
  },
  {
    quote:
      "Working with bornworks felt like having an in-house team. They understood our vision quickly and exceeded our expectations on timeline.",
    name: "Sarah Wijaya",
    role: "CEO, Nextra Digital",
    initials: "SW",
  },
  {
    quote:
      "From the initial discovery to the final launch, the team was professional and transparent. Highly recommended for any startup.",
    name: "Rizky Hermawan",
    role: "CTO, CloudSync ID",
    initials: "RH",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-32 bg-brand-light dark:bg-[#0f1629]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-brand-amber/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-amber mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl lg:text-5xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-brand-muted dark:text-white/50 text-lg">
              Real feedback from people we&apos;ve worked with.
            </p>
          </div>
        </AnimatedSection>

        {/* Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((t, index) => (
            <AnimatedSection key={index} delay={index * 0.15}>
              <div className="glass-card rounded-3xl p-8 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber/10">
                  <Quote className="w-5 h-5 text-brand-amber" strokeWidth={1.8} />
                </div>

                {/* Quote Text */}
                <p className="text-brand-dark/80 dark:text-white/70 leading-relaxed flex-1 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Person */}
                <div className="mt-6 flex items-center gap-3 pt-6 border-t border-brand-dark/5 dark:border-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-amber/15 text-brand-amber font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-dark dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-brand-muted dark:text-white/40">
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
