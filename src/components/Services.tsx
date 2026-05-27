"use client";

import { Monitor, Smartphone, Layers, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

/* ── Translations ─────────────────────────────────────── */
const t = {
  label: { en: "What We Build", id: "Yang Kami Bangun" },
  heading: { en: "Our Services", id: "Layanan Kami" },
  sub: {
    en: "Three core disciplines — every product we build falls into one of these.",
    id: "Tiga disiplin utama — setiap produk yang kami bangun ada di salah satunya.",
  },
};

/* ── Data ─────────────────────────────────────────────── */
const services = {
  en: [
    {
      icon: Monitor,
      num: "01",
      title: "Web App Development",
      description:
        "Modern, responsive web applications built with cutting-edge frameworks. From dashboards to complex platforms, we deliver performant and scalable solutions.",
      features: ["Next.js & React", "Performance-first", "Responsive & accessible"],
    },
    {
      icon: Smartphone,
      num: "02",
      title: "Mobile App (Android)",
      description:
        "Native-quality Android applications using Flutter. Beautiful interfaces, smooth animations, and seamless user experiences across every screen size.",
      features: ["Flutter (Android)", "Native-quality UX", "Offline-capable"],
    },
    {
      icon: Layers,
      num: "03",
      title: "SaaS Product",
      description:
        "End-to-end SaaS development from architecture to deployment. Scalable multi-tenant platforms with subscription management, analytics, and integrations.",
      features: ["Multi-tenant architecture", "Subscription billing", "Analytics & reporting"],
    },
  ],
  id: [
    {
      icon: Monitor,
      num: "01",
      title: "Pengembangan Web App",
      description:
        "Aplikasi web modern dan responsif dengan framework terbaru. Dari dashboard hingga platform kompleks, kami membangun solusi yang performan dan scalable.",
      features: ["Next.js & React", "Prioritas performa", "Responsif & aksesibel"],
    },
    {
      icon: Smartphone,
      num: "02",
      title: "Mobile App (Android)",
      description:
        "Aplikasi Android berkualitas native menggunakan Flutter. Antarmuka indah, animasi halus, dan pengalaman pengguna yang mulus di setiap ukuran layar.",
      features: ["Flutter (Android)", "UX berkualitas native", "Dukungan offline"],
    },
    {
      icon: Layers,
      num: "03",
      title: "Produk SaaS",
      description:
        "Pengembangan SaaS dari arsitektur hingga deployment. Platform multi-tenant scalable dengan manajemen langganan, analytics, dan berbagai integrasi.",
      features: ["Arsitektur multi-tenant", "Billing langganan", "Analytics & pelaporan"],
    },
  ],
};

/* ── Component ────────────────────────────────────────── */
export default function Services() {
  const { lang } = useLang();
  const list = services[lang];

  return (
    <section
      id="services"
      className="relative py-24 md:py-32 bg-[#fafafa] dark:bg-[#070911]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header — left-aligned */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
            {t.label[lang]}
          </span>
          <h2 className="mt-3 text-4xl font-extrabold text-brand-dark dark:text-white sm:text-5xl">
            {t.heading[lang]}
          </h2>
          <p className="mt-3 text-brand-muted dark:text-white/50 max-w-lg">
            {t.sub[lang]}
          </p>
        </motion.div>

        {/* Service rows */}
        <div className="border-t border-brand-dark/8 dark:border-white/8">
          {list.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={i}
                className="group relative grid grid-cols-1 md:grid-cols-[88px_1fr_220px] gap-6 md:gap-10 border-b border-brand-dark/8 dark:border-white/8 py-10 md:py-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Left amber accent bar on hover */}
                <div className="absolute inset-y-0 -left-4 w-[3px] bg-brand-amber rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top hidden md:block" />

                {/* Column 1 — number + icon */}
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <span className="text-5xl font-black leading-none select-none text-brand-dark/[0.07] dark:text-white/[0.07]">
                    {svc.num}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-amber/10 group-hover:bg-brand-amber/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-brand-amber" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Column 2 — title + description */}
                <div>
                  <h3 className="text-xl font-extrabold text-brand-dark dark:text-white mb-3 group-hover:text-brand-amber transition-colors duration-300">
                    {svc.title}
                  </h3>
                  <p className="text-brand-muted dark:text-white/50 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                {/* Column 3 — feature list */}
                <ul className="flex flex-col gap-2.5 md:pt-1">
                  {svc.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-brand-muted dark:text-white/45"
                    >
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 text-brand-amber/60"
                        strokeWidth={2}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
