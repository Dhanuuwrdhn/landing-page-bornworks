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

/* ── Dark Gradient Background ─────────────────────────── */
function GeometricBg() {
  return (
    <div className="absolute inset-0 overflow-x-hidden pointer-events-none">
      {/* Deep dark navy base */}
      <div className="absolute inset-0 bg-[#060b18]" />

      {/* Blue blob — slow drift left/up */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[75vw] h-[75vw] max-w-[980px] max-h-[980px] rounded-full bg-[#1e3a8a] opacity-[0.65] blur-[140px]"
        animate={{ x: [0, 45, 0], y: [0, -30, 0], scale: [1, 1.07, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Purple blob — slow drift right/down */}
      <motion.div
        className="absolute -top-[5%] right-[-15%] w-[65vw] h-[65vw] max-w-[860px] max-h-[860px] rounded-full bg-[#4c1d95] opacity-[0.55] blur-[130px]"
        animate={{ x: [0, -40, 0], y: [0, 28, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Indigo centre — breathes gently */}
      <motion.div
        className="absolute top-[25%] left-[25%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-[#3730a3] opacity-[0.40] blur-[110px]"
        animate={{ x: [0, 20, -15, 0], y: [0, 25, -10, 0], scale: [1, 1.09, 0.96, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />

      {/* Bottom fade so About card reads as separate */}
      <div className="absolute bottom-0 inset-x-0 h-[28%] bg-gradient-to-t from-[#060b18] to-transparent" />
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
    <section id="hero" className="relative overflow-x-hidden flex flex-col min-h-screen rounded-b-[2.5rem] z-10">
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
          className="text-5xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem] max-w-3xl"
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
            <p className="text-sm leading-relaxed text-white/55 max-w-[260px]">
              {t.sub1[lang]}
            </p>
            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-white/25 hidden sm:block" />
            <p className="text-sm leading-relaxed text-white/55 max-w-[180px]">
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
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/8 transition-colors"
            >
              {t.cta2[lang]}
            </a>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
