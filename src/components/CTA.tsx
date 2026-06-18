"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import ContactModal from "./ContactModal";

/* ── Config ───────────────────────────────────────────── */
const WA_NUMBER_FALLBACK = "6281234567890";
const WA_MSG = {
  en: "Hi Born2Works! I'd like to discuss my project.",
  id: "Halo Born2Works! Saya ingin diskusi tentang project saya.",
};

/* ── Translations ─────────────────────────────────────── */
const t = {
  badge: { en: "Let's Work Together",   id: "Ayo Berkolaborasi"              },
  line1: { en: "Ready to Build",        id: "Siap Membangun"                 },
  line2: { en: "Something Great?",      id: "Sesuatu yang Besar?"            },
  sub: {
    en: "Tell us about your project — we reply fast and figure out the best next step together.",
    id: "Ceritakan project Anda — kami balas cepat dan diskusikan langkah terbaik bersama.",
  },
  waCta:  { en: "Chat on WhatsApp",     id: "Chat di WhatsApp"               },
  email:  { en: "Or send us an email",  id: "Atau kirim email"               },
  note: {
    en: "Usually replies within 1 business day · Free consultation",
    id: "Biasanya balas dalam 1 hari kerja · Konsultasi gratis",
  },
};

/* ── Component ────────────────────────────────────────── */
export default function CTA({ whatsappNumber }: { whatsappNumber?: string }) {
  const { lang } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  // wa.me wants digits only (country code + number, no +/spaces)
  const waNumber = (whatsappNumber || WA_NUMBER_FALLBACK).replace(/\D/g, "");
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(WA_MSG[lang])}`;

  return (
    <section id="contact" className="relative py-28 md:py-40 bg-[#060b18] overflow-hidden">

      {/* Background — mirrors Hero gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <m.div
          className="absolute -top-[30%] -left-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-[#1e3a8a] opacity-[0.50] blur-[140px]"
          animate={{ x: [0, 35, 0], y: [0, -20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <m.div
          className="absolute -top-[20%] right-[-20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[#4c1d95] opacity-[0.45] blur-[130px]"
          animate={{ x: [0, -30, 0], y: [0, 22, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        <m.div
          className="absolute bottom-[-10%] left-[25%] w-[40vw] h-[40vw] max-w-[560px] max-h-[560px] rounded-full bg-[#3730a3] opacity-[0.30] blur-[110px]"
          animate={{ x: [0, 18, -12, 0], y: [0, 20, -8, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">

        {/* Badge */}
        <m.div
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            {t.badge[lang]}
          </span>
        </m.div>

        {/* Headline */}
        <m.h2
          className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[5rem]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          {t.line1[lang]}
          <br />
          <span className="text-brand-amber">{t.line2[lang]}</span>
        </m.h2>

        {/* Sub */}
        <m.p
          className="mt-6 text-lg leading-relaxed text-white/45 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          {t.sub[lang]}
        </m.p>

        {/* Buttons */}
        <m.div
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
            <m.span
              className="absolute inset-0 rounded-2xl ring-2 ring-[#25D366]/30"
              animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <MessageCircle className="w-5 h-5 shrink-0" />
            {t.waCta[lang]}
          </a>

          {/* Secondary — Email form modal */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-sm font-semibold text-white/55 hover:border-white/30 hover:text-white/85 transition-colors duration-300"
          >
            <Mail className="w-4 h-4" />
            {t.email[lang]}
          </button>
        </m.div>

        {/* Trust note */}
        <m.p
          className="mt-6 text-xs text-white/22"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.36 }}
        >
          {t.note[lang]}
        </m.p>

      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
