"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

/* ── Typewriter ───────────────────────────────────────── */
const wordsMap = {
  en: ["That Matter", "People Love", "That Scale"],
  id: ["Yang Bermakna", "Yang Disukai", "Yang Berkembang"],
};

function Typewriter() {
  const { lang } = useLang();
  const words = wordsMap[lang];
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const speed = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!deleting && charIndex === current.length) {
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
  }, [charIndex, deleting, wordIndex, words]);

  return (
    <span className="text-brand-amber">
      {words[wordIndex].slice(0, charIndex)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-[3px] h-[0.85em] bg-brand-amber ml-1 align-middle rounded-sm"
      />
    </span>
  );
}

/* ── Crystal Glass Background ─────────────────────────── */
// 8 overlapping parallelogram panels (skew S=70, width W=220).
// Each has a vertical gradient: opaque colour at top → transparent at ~78% height.
// Where panels overlap, opacity compounds — producing the darker triangular facets
// visible in the reference image without needing explicit highlight polygons.
// A white fade overlay on the bottom 40% cleans up the lower portion.
function GeometricBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-white dark:bg-[#07090f]" />

      <svg
        className="absolute inset-0 w-full h-full dark:opacity-30"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* gradientUnits="userSpaceOnUse" — y coords are absolute SVG pixels */}
          <linearGradient id="cp1" x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.70" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cp2" x1="0" y1="0" x2="0" y2="680" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#FED7AA" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cp3" x1="0" y1="0" x2="0" y2="710" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FBCFE8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cp4" x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cp5" x1="0" y1="0" x2="0" y2="690" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cp6" x1="0" y1="0" x2="0" y2="720" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cp7" x1="0" y1="0" x2="0" y2="730" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cp8" x1="0" y1="0" x2="0" y2="740" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Panels — formula: "(bx+70),0  (bx+290),0  (bx+220),900  bx,900"  */}
        <polygon points="-20,0  200,0  130,900  -90,900"   fill="url(#cp1)" />
        <polygon points="140,0  360,0  290,900   70,900"   fill="url(#cp2)" />
        <polygon points="300,0  520,0  450,900  230,900"   fill="url(#cp3)" />
        <polygon points="460,0  680,0  610,900  390,900"   fill="url(#cp4)" />
        <polygon points="620,0  840,0  770,900  550,900"   fill="url(#cp5)" />
        <polygon points="780,0 1000,0  930,900  710,900"   fill="url(#cp6)" />
        <polygon points="940,0 1160,0 1090,900  870,900"   fill="url(#cp7)" />
        <polygon points="1100,0 1440,0 1440,900 1030,900"  fill="url(#cp8)" />
      </svg>

      {/* Fade bottom 40% to white so text area is clean */}
      <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-white dark:from-[#07090f] to-transparent" />
    </div>
  );
}

/* ── Translations ─────────────────────────────────────── */
const t = {
  badge: { en: "Where Products Are Born", id: "Tempat Produk Dilahirkan" },
  headline: { en: "We Build Digital Products", id: "Kami Membangun Produk Digital" },
  sub1: {
    en: "From idea to launch — we craft web apps, mobile apps, and SaaS platforms.",
    id: "Dari ide hingga peluncuran — kami membangun web app, mobile app, dan platform SaaS.",
  },
  sub2: {
    en: "All without slowing down your business.",
    id: "Tanpa mengganggu bisnis utama Anda.",
  },
  cta1: { en: "Start a Project", id: "Mulai Project" },
  cta2: { en: "See Our Work", id: "Lihat Karya Kami" },
};

/* ── Component ────────────────────────────────────────── */
export default function Hero() {
  const { lang } = useLang();

  return (
    <section id="hero" className="relative overflow-hidden flex flex-col min-h-screen">
      <GeometricBg />

      {/* Content anchored to the bottom-left, matching the reference layout */}
      <div className="relative flex-1 flex flex-col justify-end mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 pt-32 pb-14">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber"
        >
          {t.badge[lang]}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-5xl font-extrabold leading-[1.06] tracking-tight text-brand-dark dark:text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem] max-w-3xl"
        >
          {t.headline[lang]}
          <br />
          <Typewriter key={lang} />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 max-w-2xl">
            <p className="text-sm leading-relaxed text-brand-muted dark:text-white/50 max-w-[260px]">
              {t.sub1[lang]}
            </p>
            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-brand-dark/25 dark:text-white/20 hidden sm:block" />
            <p className="text-sm leading-relaxed text-brand-muted dark:text-white/50 max-w-[180px]">
              {t.sub2[lang]}
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <a
              href="#contact"
              id="hero-cta-primary"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-amber px-6 py-3 text-sm font-semibold text-white hover:bg-brand-amber-dark transition-colors"
            >
              {t.cta1[lang]}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#portfolio"
              id="hero-cta-secondary"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-dark/15 dark:border-white/15 px-6 py-3 text-sm font-semibold text-brand-dark dark:text-white hover:bg-brand-dark/5 dark:hover:bg-white/5 transition-colors"
            >
              {t.cta2[lang]}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="relative h-px w-full bg-brand-dark/8 dark:bg-white/8" />
    </section>
  );
}
