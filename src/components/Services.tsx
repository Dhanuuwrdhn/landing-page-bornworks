"use client";

import { Monitor, Smartphone, Layers } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const services = [
  {
    icon: Monitor,
    title: "Web App Development",
    description:
      "Modern, responsive web applications built with cutting-edge frameworks. From dashboards to complex platforms, we deliver performant solutions.",
  },
  {
    icon: Smartphone,
    title: "Mobile App (Android)",
    description:
      "Native-quality Android applications using Flutter. Beautiful interfaces, smooth performance, and seamless user experiences on every device.",
  },
  {
    icon: Layers,
    title: "SaaS Product",
    description:
      "End-to-end SaaS development from architecture to deployment. Scalable multi-tenant platforms with subscription management and analytics.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-24 md:py-32 bg-white dark:bg-[#0a0e1a]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-amber/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-amber mb-4">
              Services
            </span>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl lg:text-5xl">
              What We Build
            </h2>
            <p className="mt-4 text-brand-muted dark:text-white/50 text-lg">
              We specialize in three core areas to bring your digital products to life.
            </p>
          </div>
        </AnimatedSection>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <AnimatedSection key={index} delay={index * 0.15}>
                <div className="glass-card rounded-3xl p-8 md:p-10 border-t-2 border-t-brand-amber h-full">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-amber/10">
                    <Icon className="w-7 h-7 text-brand-amber" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-brand-muted dark:text-white/50 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
