"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, Pen, Code2, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useLang } from "@/contexts/LanguageContext";

/* ── Translations ─────────────────────────────────────── */
const t = {
  label:   { en: "How We Work",  id: "Cara Kami Bekerja" },
  heading: { en: "Our Process",  id: "Proses Kami"       },
  sub: {
    en: "A proven approach that turns your idea into a shipped product.",
    id: "Pendekatan teruji yang mengubah ide Anda menjadi produk yang siap rilis.",
  },
};

/* ── Data ─────────────────────────────────────────────── */
const steps = {
  en: [
    { icon: Search, title: "Discovery", description: "We dive deep into your vision, market, and users to define the right product strategy.", step: 1 },
    { icon: Pen,    title: "Design",    description: "Wireframes, prototypes, and polished UI/UX — we design interfaces people love to use.",   step: 2 },
    { icon: Code2,  title: "Build",     description: "Clean, scalable code with modern frameworks. Every feature tested and optimized.",          step: 3 },
    { icon: Rocket, title: "Ship",      description: "Launch day and beyond — deployment, monitoring, and continuous iteration.",                 step: 4 },
  ],
  id: [
    { icon: Search, title: "Riset",   description: "Kami mendalami visi, pasar, dan pengguna Anda untuk menentukan strategi produk yang tepat.",    step: 1 },
    { icon: Pen,    title: "Desain",  description: "Wireframe, prototipe, dan UI/UX yang matang — kami mendesain antarmuka yang disukai pengguna.", step: 2 },
    { icon: Code2,  title: "Bangun",  description: "Kode bersih dan scalable dengan framework modern. Setiap fitur diuji dan dioptimasi.",          step: 3 },
    { icon: Rocket, title: "Rilis",   description: "Hari peluncuran dan seterusnya — deployment, monitoring, dan iterasi berkelanjutan.",            step: 4 },
  ],
};

/* ── Colours ──────────────────────────────────────────── */
const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a78bfa"];

/*
  Straight full-viewport-width ribbon.
  viewBox "0 0 1000 20", line at y=10.
  The SVG is broken out of its container via
  left:50% + translateX(-50%) + width:100vw so it runs
  from the left to the right edge of the screen.
  overflow-x-hidden on the section clips any bleed.
*/
const RIBBON = "M 0,10 L 1000,10";

/* ── Component ────────────────────────────────────────── */
export default function Process() {
  const { lang } = useLang();
  const list = steps[lang];
  const N    = list.length;

  const sectionRef = useRef<HTMLElement>(null);
  const fillRef    = useRef<SVGPathElement>(null);
  const lenRef     = useRef(0);
  const prevRef    = useRef(-1);
  const tweenRef   = useRef<gsap.core.Tween | null>(null);
  const goToRef    = useRef<(n: number) => void>(() => {});

  const [activeIndex, setActiveIndex] = useState(-1);

  const goTo = useCallback((n: number) => {
    prevRef.current = n;
    setActiveIndex(n);
  }, []);

  useEffect(() => { goToRef.current = goTo; }, [goTo]);

  /* ── Measure ribbon length once on mount ── */
  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    const len = fill.getTotalLength();
    lenRef.current = len;
    gsap.set(fill, { strokeDasharray: len, strokeDashoffset: len });
  }, []);

  /* ── Animation: runs every time section enters viewport ── */
  const playAnimation = useCallback(() => {
    const fill = fillRef.current;
    const len  = lenRef.current;
    if (!fill || !len) return;

    tweenRef.current?.kill();
    prevRef.current = -1;
    setActiveIndex(-1);
    gsap.set(fill, { strokeDashoffset: len });

    tweenRef.current = gsap.to(fill, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate() {
        const offset = gsap.getProperty(fill, "strokeDashoffset") as number;
        const p      = 1 - offset / len;
        let next = -1;
        for (let i = N - 1; i >= 0; i--) {
          if (p >= (i + 0.5) / N) { next = i; break; }
        }
        if (next !== prevRef.current) goToRef.current(next);
      },
    });
  }, [N]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) playAnimation(); },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      tweenRef.current?.kill();
    };
  }, [playAnimation]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-24 md:py-32 bg-[#0d1117] overflow-x-hidden"
    >
      <div className="flex flex-col items-center gap-16 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
            {t.label[lang]}
          </span>
          <h2 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
            {t.heading[lang]}
          </h2>
          <p className="mt-4 text-white/45 text-lg">{t.sub[lang]}</p>
        </motion.div>

        {/* ── Desktop: ribbon + cards ── */}
        <div className="relative hidden md:block w-full" style={{ height: 300 }}>

          {/*
            Full-viewport-width SVG ribbon.
            left:50% + translateX(-50%) centres the element relative to
            the page (since this container is itself centred), so with
            width:100vw the line runs from the exact left to right screen edge.
            overflow-x-hidden on the section prevents a horizontal scrollbar.
          */}
          <svg
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top:  "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: 20,
            }}
            viewBox="0 0 1000 20"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="ribGrad" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="33%"  stopColor="#6366f1" />
                <stop offset="66%"  stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              {/* Very subtle glow — just enough to feel lit */}
              <filter id="lineGlow" x="0" y="-300%" width="100%" height="700%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dotted track — visible before animation runs */}
            <path
              d={RIBBON}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 10"
            />
            {/* Animated gradient fill */}
            <path
              ref={fillRef}
              d={RIBBON}
              fill="none"
              stroke="url(#ribGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#lineGlow)"
            />
          </svg>

          {/* Cards — solid, no blur */}
          <div className="relative z-10 grid grid-cols-4 gap-5 h-full items-center">
            {list.map((step, i) => {
              const Icon   = step.icon;
              const c      = COLORS[i];
              const isLit  = i <= activeIndex;
              const isCurr = i === activeIndex;

              return (
                <motion.div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-3xl p-6 text-center h-[230px]"
                  animate={{
                    y:     isCurr ? -10 : 0,
                    scale: isCurr ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: isLit
                      ? `linear-gradient(150deg, #1c2030 0%, ${c}1e 100%)`
                      : "#111520",
                    border: `1px solid ${isLit ? c + "50" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: isCurr
                      ? `0 16px 40px ${c}22, 0 0 0 1px ${c}28`
                      : isLit
                      ? `0 4px 18px ${c}14`
                      : "none",
                    transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: isLit ? c + "22" : "rgba(255,255,255,0.05)",
                      transition: "background 0.5s",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isLit ? c : "rgba(255,255,255,0.18)", transition: "color 0.5s" }}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Step number */}
                  <span
                    className="text-[10px] font-black mb-1 tabular-nums"
                    style={{ color: isLit ? c : "rgba(255,255,255,0.15)", transition: "color 0.5s" }}
                  >
                    {String(step.step).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-extrabold text-sm mb-2 leading-tight"
                    style={{ color: isLit ? "#fff" : "rgba(255,255,255,0.2)", transition: "color 0.5s" }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: isLit ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)", transition: "color 0.5s" }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Progress dots (desktop) ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {list.map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width:      i <= activeIndex ? 24 : 8,
                height:     6,
                background: i <= activeIndex ? COLORS[i] : "rgba(255,255,255,0.1)",
                transition: "width 0.4s ease, background 0.5s ease",
              }}
            />
          ))}
        </div>

        {/* ── Mobile: vertical list ── */}
        <div className="md:hidden w-full flex flex-col gap-6">
          {list.map((step, i) => {
            const Icon = step.icon;
            const c    = COLORS[i];
            return (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className="relative shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base"
                  style={{ background: `linear-gradient(135deg, ${c}cc, ${c}55)`, border: `1px solid ${c}55` }}
                >
                  {step.step}
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: c }} strokeWidth={1.8} />
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
