"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Eye } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

/* ── Translations ─────────────────────────────────────── */
const t = {
  label: { en: "About us",   id: "Tentang kami"   },
  heading: {
    en: "A small team of builders who care deeply about the craft",
    id: "Tim kecil yang sangat peduli dengan kualitas hasil kerja",
  },
  sub: {
    en: "Born2Works was founded on a simple belief: great software changes how people live and work. Based in Indonesia, we partner with founders and businesses who want digital products done right — fast, clean, and built to last.",
    id: "Born2Works didirikan atas satu keyakinan: software yang bagus mengubah cara orang hidup dan bekerja. Berbasis di Indonesia, kami bermitra dengan founder dan bisnis yang menginginkan produk digital yang benar — cepat, bersih, dan tahan lama.",
  },
  badge: {
    en: "Based in Indonesia · Est. 2024",
    id: "Berbasis di Indonesia · Berdiri 2024",
  },
  values: {
    en: [
      { icon: Zap,    title: "Move fast",    desc: "We ship early and iterate quickly. No over-engineering, no endless planning." },
      { icon: Shield, title: "Build right",  desc: "Quality code, tested features, and clean architecture — every time."          },
      { icon: Eye,    title: "Stay honest",  desc: "Regular updates, transparent timelines, no surprises."                        },
    ],
    id: [
      { icon: Zap,    title: "Bergerak cepat",  desc: "Kami ship lebih awal dan iterasi cepat. Tanpa over-engineering atau perencanaan yang berlarut." },
      { icon: Shield, title: "Bangun dengan benar", desc: "Kode berkualitas, fitur teruji, dan arsitektur bersih — setiap saat."                      },
      { icon: Eye,    title: "Tetap jujur",  desc: "Update rutin, timeline transparan, tanpa kejutan."                                                 },
    ],
  },
};

/* ── Component ────────────────────────────────────────── */
export default function About() {
  const { lang } = useLang();
  const values = t.values[lang];

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 bg-white dark:bg-[#0a0e1a] overflow-hidden"
    >
      {/* Subtle amber blob */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[520px] h-[520px] bg-brand-amber/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">

          {/* Left — headline + description */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
              {t.label[lang]}
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] text-brand-dark dark:text-white sm:text-4xl lg:text-[2.75rem]">
              {t.heading[lang]}
            </h2>

            <p className="mt-6 text-base leading-relaxed text-brand-muted dark:text-white/50 max-w-lg">
              {t.sub[lang]}
            </p>

            {/* Founded badge */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-brand-dark/8 dark:border-white/8 px-5 py-3">
              <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse shrink-0" />
              <span className="text-sm font-medium text-brand-dark dark:text-white">
                {t.badge[lang]}
              </span>
            </div>
          </motion.div>

          {/* Right — three value pillars */}
          <div className="flex flex-col gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  className="flex items-start gap-5 rounded-2xl p-5 border border-brand-dark/6 dark:border-white/6 bg-brand-light/60 dark:bg-white/[0.03] hover:border-brand-amber/40 hover:bg-brand-amber/[0.03] transition-colors duration-300"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                >
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber/10">
                    <Icon className="w-5 h-5 text-brand-amber" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-dark dark:text-white mb-0.5">
                      {v.title}
                    </h3>
                    <p className="text-sm text-brand-muted dark:text-white/45 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
