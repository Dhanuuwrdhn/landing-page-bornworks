"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

/* ── Config ───────────────────────────────────────────── */
// Keep in sync with FloatingWhatsApp.tsx
const WA_NUMBER = "6281234567890"; // ← replace with actual number

const WA_MSG = {
  en: "Hi Born2Works! I'd like to discuss my project.",
  id: "Halo Born2Works! Saya ingin diskusi tentang project saya.",
};

/* ── Translations ─────────────────────────────────────── */
const t = {
  badge:  { en: "Let's Talk",                        id: "Ayo Ngobrol"                              },
  line1:  { en: "Ready to Build",                    id: "Siap Membangun"                           },
  line2:  { en: "Something Great?",                  id: "Sesuatu yang Besar?"                      },
  sub: {
    en: "Tell us about your project — we'll reply fast and figure out the best next step together.",
    id: "Ceritakan project Anda — kami balas cepat dan diskusikan langkah terbaik bersama.",
  },
  waCta:  { en: "Chat on WhatsApp",                  id: "Chat di WhatsApp"                         },
  email:  { en: "Or send us an email",               id: "Atau kirim email"                         },
  note:   { en: "Usually replies within 1 business day · Free consultation",
            id: "Biasanya balas dalam 1 hari kerja · Konsultasi gratis"                              },
};

/* ── Floating ambient circles ─────────────────────────── */
const FLOATS = [
  { left: "8%",  top: "18%", size: 72,  delay: 0,   dur: 5   },
  { left: "82%", top: "12%", size: 48,  delay: 0.6, dur: 6   },
  { left: "4%",  top: "68%", size: 36,  delay: 1.2, dur: 4.5 },
  { left: "88%", top: "62%", size: 56,  delay: 0.3, dur: 5.5 },
  { left: "50%", top: "5%",  size: 28,  delay: 1.8, dur: 7   },
];

/* ── Component ────────────────────────────────────────── */
export default function CTA() {
  const { lang } = useLang();
  const waUrl    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG[lang])}`;

  return (
    <section id="contact" className="relative py-28 md:py-40 bg-[#070910] overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Amber glow blob */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-amber/[0.07] rounded-full blur-[120px]" />
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" aria-hidden>
          <defs>
            <pattern id="ctaDots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaDots)" />
        </svg>
        {/* Floating circles */}
        {FLOATS.map((f, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-brand-amber/10 bg-brand-amber/[0.04]"
            style={{ left: f.left, top: f.top, width: f.size, height: f.size }}
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-brand-amber/20 bg-brand-amber/[0.08] px-4 py-1.5 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
            {t.badge[lang]}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[5rem]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          {t.line1[lang]}
          <br />
          <span className="text-brand-amber">{t.line2[lang]}</span>
        </motion.h2>

        {/* Sub-copy */}
        <motion.p
          className="mt-6 text-lg leading-relaxed text-white/45 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          {t.sub[lang]}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.26 }}
        >
          {/* Primary — WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#1fba57] hover:shadow-[#25D366]/35 transition-all duration-300"
          >
            {/* Animated ring */}
            <motion.span
              className="absolute inset-0 rounded-2xl ring-2 ring-[#25D366]/30"
              animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <MessageCircle className="w-5 h-5 shrink-0" />
            {t.waCta[lang]}
          </a>

          {/* Secondary — Email */}
          <a
            href="mailto:hello@bornworks.id"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-4 text-sm font-semibold text-white/55 hover:border-white/22 hover:text-white/85 transition-colors duration-300"
          >
            <Mail className="w-4 h-4" />
            {t.email[lang]}
          </a>
        </motion.div>

        {/* Micro trust note */}
        <motion.p
          className="mt-6 text-xs text-white/22"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.36 }}
        >
          {t.note[lang]}
        </motion.p>

      </div>
    </section>
  );
}
