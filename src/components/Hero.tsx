"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

/* ── Animated Counter ─────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ── Typewriter Effect ────────────────────────────────── */
const words = ["That Matter", "People Love", "That Scale"];

function Typewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const speed = deleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!deleting && charIndex === current.length) {
        // Pause at full word, then start deleting
        setTimeout(() => setDeleting(true), 2000);
        return;
      }
      if (deleting && charIndex === 0) {
        setDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
      setCharIndex((prev) => prev + (deleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex]);

  return (
    <span className="relative z-10 text-brand-amber">
      {words[wordIndex].slice(0, charIndex)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-[3px] h-[0.85em] bg-brand-amber ml-0.5 align-middle rounded-full"
      />
    </span>
  );
}

/* ── Dot Grid Background ──────────────────────────────── */
function DotGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.35] dark:opacity-[0.15]">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-brand-dark/20" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
    </div>
  );
}

/* ── Stats Data ───────────────────────────────────────── */
const stats = [
  { icon: TrendingUp, value: 12, suffix: "+", label: "Projects Launched" },
  { icon: Users, value: 8, suffix: "+", label: "Happy Clients" },
  { icon: Star, value: 2, suffix: "+", label: "Years Experience" },
];

/* ── Hero Component ───────────────────────────────────── */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden gradient-hero pt-28 pb-20 md:pt-40 md:pb-32"
    >
      {/* Dot grid pattern */}
      <DotGrid />

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-amber/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl" />
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-20 hidden lg:block"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-amber/10 flex items-center justify-center">
            <ArrowUp className="w-7 h-7 text-brand-amber" strokeWidth={2} />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-16 hidden lg:block"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-amber/8 flex items-center justify-center rotate-12">
            <ArrowUp className="w-5 h-5 text-brand-amber/60" strokeWidth={2} />
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Tagline badge */}
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-amber/10 px-4 py-1.5 mb-8">
              <ArrowUp className="w-4 h-4 text-brand-amber" strokeWidth={2.5} />
              <span className="text-sm font-medium text-brand-amber-dark dark:text-brand-amber">
                Where Products Are Born
              </span>
            </div>
          </AnimatedSection>

          {/* Headline with Typewriter */}
          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brand-dark dark:text-white sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              We Build Digital Products{" "}
              <span className="relative">
                <Typewriter />
                <span className="absolute inset-x-0 bottom-1 h-3 bg-brand-amber/15 rounded-sm -z-0 md:h-4 md:bottom-2" />
              </span>
            </h1>
          </AnimatedSection>

          {/* Subheadline */}
          <AnimatedSection delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted dark:text-white/50 md:text-xl">
              From idea to launch — we craft web apps, mobile apps, and SaaS
              platforms.
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection delay={0.3}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5">
              <a
                href="#contact"
                id="hero-cta-primary"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-amber px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-amber/30 hover:bg-brand-amber-dark hover:shadow-brand-amber/50 transition-all duration-300"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#portfolio"
                id="hero-cta-secondary"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-dark/20 dark:border-white/20 px-8 py-4 text-base font-semibold text-brand-dark dark:text-white hover:border-brand-dark/40 dark:hover:border-white/40 hover:bg-brand-dark/5 dark:hover:bg-white/5 transition-all duration-300"
              >
                See Our Work
              </a>
            </div>
          </AnimatedSection>

          {/* Stats Card with Animated Counters */}
          <AnimatedSection delay={0.4}>
            <div className="mt-16 w-full max-w-2xl">
              <div className="glass rounded-3xl p-6 md:p-8 amber-glow">
                <div className="grid grid-cols-3 divide-x divide-brand-dark/10 dark:divide-white/10">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center px-2 md:px-6"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber/10">
                          <Icon className="w-5 h-5 text-brand-amber" />
                        </div>
                        <span className="text-2xl font-bold text-brand-dark dark:text-white md:text-3xl">
                          <Counter target={stat.value} suffix={stat.suffix} />
                        </span>
                        <span className="mt-1 text-xs font-medium text-brand-muted dark:text-white/50 md:text-sm">
                          {stat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
