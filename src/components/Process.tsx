"use client";

import { Search, Pen, Code2, Rocket } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    icon: Search,
    title: "Discovery",
    description:
      "We dive deep into your vision, market, and users to define the right product strategy.",
    step: 1,
  },
  {
    icon: Pen,
    title: "Design",
    description:
      "Wireframes, prototypes, and polished UI/UX — we design interfaces people love to use.",
    step: 2,
  },
  {
    icon: Code2,
    title: "Build",
    description:
      "Clean, scalable code with modern frameworks. Every feature tested and optimized.",
    step: 3,
  },
  {
    icon: Rocket,
    title: "Ship",
    description:
      "Launch day and beyond — deployment, monitoring, and continuous iteration.",
    step: 4,
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative py-24 md:py-32 bg-brand-light dark:bg-[#0f1629]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-amber mb-4">
              How We Work
            </span>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white sm:text-4xl lg:text-5xl">
              Our Process
            </h2>
            <p className="mt-4 text-brand-muted dark:text-white/50 text-lg">
              A proven approach that turns your idea into a shipped product.
            </p>
          </div>
        </AnimatedSection>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="absolute top-[30px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] hidden md:flex items-center">
            <div className="w-full h-[3px] bg-gradient-to-r from-brand-amber via-brand-amber/60 to-brand-amber rounded-full" />
          </div>

          <div className="grid gap-8 md:grid-cols-4 md:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={index} delay={index * 0.15}>
                  <div className="flex flex-col items-center text-center">
                    {/* Step Number Circle */}
                    <div className="relative mb-6">
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 rounded-full bg-brand-amber/20 scale-125" />
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-amber text-white font-bold text-lg shadow-lg shadow-brand-amber/30 z-10 relative">
                        {step.step}
                      </div>
                    </div>

                    {/* Glass Card */}
                    <div className="glass-card rounded-2xl p-6 w-full">
                      <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-brand-amber/10">
                        <Icon
                          className="w-6 h-6 text-brand-amber"
                          strokeWidth={1.8}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-brand-muted dark:text-white/50 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
