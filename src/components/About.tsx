"use client";

import { m } from "framer-motion";
import { Zap, Shield, Eye } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { AboutSection, AboutValue } from "@/types/cms";
import { fallbackAbout } from "@/lib/cms";

/* ── Icon mapping (CMS stores icon name as string) ─────── */
type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const iconMap: Record<string, IconComponent> = {
  Zap,
  Shield,
  Eye,
};

/* ── Props ─────────────────────────────────────────────── */
interface AboutProps {
  about?: AboutSection;
}

/* ── Component ────────────────────────────────────────── */
export default function About({ about }: AboutProps) {
  const { lang } = useLang();
  const data = about ?? fallbackAbout;

  const values: AboutValue[] = data.values[lang];

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 bg-white dark:bg-[#0d1117] overflow-x-hidden z-10"
    >
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle amber blob — keeps brand colour present */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[520px] h-[520px] bg-brand-amber/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">

          {/* Left — headline + description */}
          <m.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
              {data.label[lang]}
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] text-brand-dark dark:text-white sm:text-4xl lg:text-[2.75rem]">
              {data.heading[lang]}
            </h2>

            <p className="mt-6 text-base leading-relaxed text-brand-muted dark:text-white/50 max-w-lg">
              {data.sub[lang]}
            </p>

            {/* Founded badge */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-brand-dark/8 dark:border-white/8 px-5 py-3">
              <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse shrink-0" />
              <span className="text-sm font-medium text-brand-dark dark:text-white">
                {data.badge[lang]}
              </span>
            </div>
          </m.div>

          {/* Right — three value pillars */}
          <div className="flex flex-col gap-4">
            {values.map((v, i) => {
              const Icon = iconMap[v.icon] ?? Zap;
              return (
                <m.div
                  key={i}
                  className="flex items-start gap-5 rounded-2xl p-5 border border-brand-dark/8 dark:border-white/6 bg-brand-light dark:bg-white/[0.03] hover:border-brand-amber/40 hover:bg-brand-amber/[0.03] transition-colors duration-300"
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
                      {v.title ?? ''}
                    </h3>
                    <p className="text-sm text-brand-muted dark:text-white/45 leading-relaxed">
                      {v.desc ?? ''}
                    </p>
                  </div>
                </m.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
