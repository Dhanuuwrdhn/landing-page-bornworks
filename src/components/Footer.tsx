"use client";

import { ArrowUp, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { FooterSection } from "@/types/cms";
import { fallbackFooter } from "@/lib/cms";

/* ── Props ─────────────────────────────────────────────── */
interface FooterProps {
  footer?: FooterSection;
}

/* ── Component ────────────────────────────────────────── */
export default function Footer({ footer }: FooterProps) {
  const { lang } = useLang();
  const data = footer ?? fallbackFooter;
  const footerLinks = data.linkGroups[lang];

  return (
    <footer id="footer" className="bg-brand-dark dark:bg-[#060912]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 group mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-amber/20 group-hover:bg-brand-amber/30 transition-colors">
                <ArrowUp className="w-5 h-5 text-brand-amber" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">born</span>
                <span className="text-brand-amber">works</span>
              </span>
            </a>
            <p className="text-white/50 max-w-sm leading-relaxed mt-4">{data.desc[lang]}</p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-white/40">
                <span className="text-white/60 font-medium">Email:</span> {data.email}
              </p>
              <p className="text-sm text-white/40">
                <span className="text-white/60 font-medium">Location:</span> {data.location}
              </p>
            </div>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="group flex items-center gap-2 text-sm text-white/40 hover:text-brand-amber transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-amber/50 group-hover:text-brand-amber group-hover:translate-x-0.5 transition-all" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/30">
              &copy; 2026 {data.copyrightName}. {data.rights[lang]}
            </p>
            <a href="#" className="flex items-center gap-2 text-sm text-white/30 hover:text-brand-amber transition-colors">
              <ArrowUp className="w-4 h-4" />
              {data.backTop[lang]}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
