"use client";

import { Search, Pen, Code2, Rocket } from "lucide-react";
import { motion } from "framer-motion";
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

/* ── Per-step accent colours ──────────────────────────── */
const COLORS = [
  { accent: "#F59E0B", glow: "#F59E0B44", border: "#F59E0B66" },
  { accent: "#EC4899", glow: "#EC489944", border: "#EC489966" },
  { accent: "#A855F7", glow: "#A855F744", border: "#A855F766" },
  { accent: "#3B82F6", glow: "#3B82F644", border: "#3B82F666" },
];

/* ── Wave background ──────────────────────────────────── */
function WaveBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#f9f5f0] dark:bg-[#07090f] transition-colors" />

      {/* Colorful wave layers — subtle in light mode, vivid in dark */}
      <div className="absolute inset-0 opacity-25 dark:opacity-75">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id="wv1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient id="wv2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#EC4899" stopOpacity="0.10" />
              <stop offset="50%"  stopColor="#A855F7" stopOpacity="0.90" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient id="wv3" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.90" />
            </linearGradient>
          </defs>
          {/* Top wave — amber */}
          <path
            d="M0,90 Q180,20 360,90 Q540,160 720,90 Q900,20 1080,90 Q1260,160 1440,90 L1440,0 L0,0 Z"
            fill="url(#wv1)"
          />
          {/* Mid band — pink → violet */}
          <path
            d="M0,370 Q240,290 480,370 Q720,450 960,370 Q1200,290 1440,370
               L1440,250 Q1200,170 960,250 Q720,330 480,250 Q240,170 0,250 Z"
            fill="url(#wv2)"
          />
          {/* Bottom wave — blue */}
          <path
            d="M0,620 Q360,545 720,620 Q1080,695 1440,620 L1440,700 L0,700 Z"
            fill="url(#wv3)"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Component ────────────────────────────────────────── */
// Grid height in px — controls zigzag proportions.
// DOWN nodes (i=0,2): justify-end → circle bottom-anchored, y ≈ GRID_H − 28
// UP   nodes (i=1,3): justify-start → circle top-anchored,  y ≈ 28
const GRID_H = 380;
const NODE_R = 28; // half of w-14 (56 px)

export default function Process() {
  const { lang } = useLang();
  const list = steps[lang];

  return (
    <section id="process" className="relative py-24 md:py-32 overflow-hidden">
      <WaveBg />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
            {t.label[lang]}
          </span>
          <h2 className="mt-3 text-4xl font-extrabold text-brand-dark dark:text-white sm:text-5xl">
            {t.heading[lang]}
          </h2>
          <p className="mt-4 text-brand-muted dark:text-white/50 text-lg">{t.sub[lang]}</p>
        </motion.div>

        {/* ── Desktop zigzag ────────────────────────────── */}
        <div
          className="relative hidden md:grid grid-cols-4"
          style={{ height: GRID_H }}
        >
          {/* Animated gradient connector */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 1000 ${GRID_H}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="connGrad" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#F59E0B" />
                <stop offset="33%"  stopColor="#EC4899" />
                <stop offset="66%"  stopColor="#A855F7" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            {/*
              Column centres (x): 125, 375, 625, 875
              DOWN (i=0,2): y = GRID_H − NODE_R = 352
              UP   (i=1,3): y = NODE_R           = 28
            */}
            <motion.path
              d={`M 125,${GRID_H - NODE_R}
                  C 250,${GRID_H - NODE_R} 250,${NODE_R} 375,${NODE_R}
                  S 500,${GRID_H - NODE_R} 625,${GRID_H - NODE_R}
                  S 750,${NODE_R} 875,${NODE_R}`}
              fill="none"
              stroke="url(#connGrad)"
              strokeWidth="2"
              strokeDasharray="8 5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.65 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.5 }}
            />
          </svg>

          {/* Step nodes */}
          {list.map((step, i) => {
            const up   = i % 2 === 1;
            const Icon = step.icon;
            const c    = COLORS[i];

            const textBlock = (
              <div className={`${up ? "mt-5" : "mb-5"} text-center px-4`}>
                <div
                  className="flex h-9 w-9 mx-auto mb-2.5 items-center justify-center rounded-lg"
                  style={{ background: c.accent + "1a", border: `1px solid ${c.accent}33` }}
                >
                  <Icon className="w-5 h-5" style={{ color: c.accent }} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-bold text-brand-dark dark:text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-brand-muted dark:text-white/45 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );

            return (
              <motion.div
                key={i}
                className={`flex flex-col items-center h-full ${up ? "justify-start" : "justify-end"}`}
                initial={{ opacity: 0, y: up ? -28 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.14 }}
              >
                {/* Text above — only for DOWN steps */}
                {!up && textBlock}

                {/* Circle node */}
                <div className="relative shrink-0">
                  <div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{ backgroundColor: c.glow, transform: "scale(2.2)" }}
                  />
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${c.accent}ee 0%, ${c.accent}66 100%)`,
                      border: `2px solid ${c.border}`,
                      boxShadow: `0 0 30px ${c.glow}`,
                    }}
                  >
                    {step.step}
                  </div>
                </div>

                {/* Text below — only for UP steps */}
                {up && textBlock}
              </motion.div>
            );
          })}
        </div>

        {/* ── Mobile: vertical list ─────────────────────── */}
        <div className="md:hidden flex flex-col gap-7">
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
                <div className="relative shrink-0">
                  <div
                    className="absolute inset-0 rounded-full blur-md"
                    style={{ backgroundColor: c.glow }}
                  />
                  <div
                    className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base"
                    style={{
                      background: `linear-gradient(135deg, ${c.accent}ee, ${c.accent}66)`,
                      border: `2px solid ${c.border}`,
                    }}
                  >
                    {step.step}
                  </div>
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: c.accent }} strokeWidth={1.8} />
                    <h3 className="text-sm font-bold text-brand-dark dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-xs text-brand-muted dark:text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
