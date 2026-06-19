"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/contexts/LanguageContext";
import { PortfolioItem } from "@/types/cms";
import { fallbackPortfolio } from "@/lib/cms";

/* ── Section labels (not in CMS — static) ─────────────── */
const sectionT = {
  label: { en: "Portfolio",    id: "Portofolio"    },
  view:  { en: "View Project", id: "Lihat Project" },
};

/* ── Image panel variants (film-camera slide) ─────────── */
// direction > 0 → advancing: old exits LEFT, new enters from RIGHT
// direction < 0 → retreating: old exits RIGHT, new enters from LEFT
const filmVariants = {
  initial: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
  animate: { x: "0%" },
  exit:    (d: number) => ({ x: d > 0 ? "-105%" : "105%" }),
};

/* ── SlipWords — light-year text reveal ───────────────── */
function SlipWords({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", lineHeight: 1.15 }}
        >
          <m.span
            style={{ display: "inline-block" }}
            initial={{ y: "118%", rotate: 3 }}
            animate={{ y: "0%",   rotate: 0 }}
            transition={{
              duration: 0.65,
              delay: baseDelay + i * 0.048,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}&nbsp;
          </m.span>
        </span>
      ))}
    </>
  );
}

/* ── Props ─────────────────────────────────────────────── */
interface PortfolioProps {
  portfolio?: PortfolioItem[];
}

/* ── Component ────────────────────────────────────────── */
export default function Portfolio({ portfolio }: PortfolioProps) {
  const { lang } = useLang();
  const list = portfolio ?? fallbackPortfolio;
  const N    = list.length;

  const sectionRef = useRef<HTMLElement>(null);
  const stRef      = useRef<ScrollTrigger | null>(null);
  const prevRef    = useRef(0);
  const goToRef    = useRef<(i: number) => void>(() => {});

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction,   setDirection]   = useState<1 | -1>(1);

  const goTo = useCallback((idx: number) => {
    const c = Math.max(0, Math.min(N - 1, idx));
    setDirection(c >= prevRef.current ? 1 : -1);
    prevRef.current = c;
    setActiveIndex(c);
  }, [N]);

  // Keep a stable ref so ScrollTrigger never holds a stale closure
  useEffect(() => { goToRef.current = goTo; }, [goTo]);

  /* ── GSAP ScrollTrigger: pins the section, drives the index ──
     Only on desktop (md+). On mobile the projects render as a normal
     vertical card list, so we must NOT pin / hijack the scroll. ── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      stRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${(N - 1) * 900}`,
        pin: true,
        snap: {
          snapTo: 1 / (N - 1),
          duration: { min: 0.3, max: 0.6 },
          ease: "power2.inOut",
          delay: 0.05,
        },
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (N - 1));
          if (idx !== prevRef.current) goToRef.current(idx);
        },
      });
      return () => { stRef.current = null; };
    });

    return () => mm.revert();
  }, [N]);

  /* ── Keyboard ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeIndex, goTo]);

  const scrollTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    window.scrollTo({ top: st.start + (i / (N - 1)) * (st.end - st.start), behavior: "smooth" });
  };

  const project = list[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-white dark:bg-[#0a0e1a]"
    >
      {/* MOBILE (< md): simple vertical card list, normal scroll */}
      <div className="md:hidden px-4 sm:px-6 py-20">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
            {sectionT.label[lang]}
          </span>
        </div>

        <div className="flex flex-col gap-8">
          {list.map((p, i) => (
            <m.article
              key={p.id ?? i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-2xl border border-brand-dark/8 dark:border-white/8 bg-brand-light dark:bg-white/[0.03]"
            >
              {/* Image / decorative panel */}
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.bgClass} flex items-center justify-center`}>
                {p.imageUrl ? (
                  <div className="absolute inset-0 p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={p.imageUrl}
                        alt={p.title[lang]}
                        fill
                        sizes="100vw"
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${p.accentClass} shadow-xl shadow-black/20`} />
                    <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-xl bg-gradient-to-br ${p.accentClass} opacity-40`} />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(p.tags?.[lang] ?? p.tags?.en ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-brand-amber/10 px-2.5 py-1 text-[11px] font-semibold text-brand-amber-dark dark:text-brand-amber"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-brand-dark dark:text-white">
                  {p.title[lang]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted dark:text-white/50">
                  {p.description[lang]}
                </p>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-amber"
                  >
                    {sectionT.view[lang]}
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </m.article>
          ))}
        </div>
      </div>

      {/* DESKTOP (md+): pinned film-slider */}
      <div className="hidden md:flex" style={{ height: "100vh" }}>

        {/* LEFT: image panel — film-camera horizontal slide */}
        <div className="relative w-[55%] overflow-hidden">
          <AnimatePresence mode="sync" custom={direction}>
            <m.div
              key={activeIndex}
              custom={direction}
              variants={filmVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
              className={`absolute inset-0 bg-gradient-to-br ${project.bgClass} flex items-center justify-center`}
            >
              {project.imageUrl ? (
                /* Project screenshot — shown in full (no crop) on the gradient */
                <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                  <div className="relative w-full h-full">
                    <Image
                      src={project.imageUrl}
                      alt={project.title[lang]}
                      fill
                      priority={activeIndex === 0}
                      sizes="55vw"
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Faint number watermark */}
                  <span
                    className="absolute bottom-10 right-10 font-black leading-none pointer-events-none select-none"
                    style={{ fontSize: "clamp(100px,14vw,200px)", color: "rgba(0,0,0,0.04)" }}
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>

                  {/* Decorative accent shapes */}
                  <div className="relative">
                    <div className={`w-52 h-52 rounded-[2rem] bg-gradient-to-br ${project.accentClass} shadow-2xl shadow-black/20`} />
                    <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-gradient-to-br ${project.accentClass} opacity-40`} />
                    <div className={`absolute -top-6  -left-6  w-20 h-20 rounded-xl   bg-gradient-to-br ${project.accentClass} opacity-25`} />
                  </div>
                </>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: text panel */}
        <div className="relative w-[45%] overflow-hidden">

          {/* Static label — always visible */}
          <div className="absolute top-12 left-14 z-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
              {sectionT.label[lang]}
            </span>
          </div>

          {/* Animated text block */}
          <AnimatePresence mode="sync">
            <m.div
              key={activeIndex}
              className="absolute inset-0 flex flex-col justify-center px-14 gap-5"
              initial={{ y: "6%",  opacity: 0 }}
              animate={{ y: "0%",  opacity: 1 }}
              exit={{    y: "-6%", opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(project.tags?.[lang] ?? project.tags?.en ?? []).map((tag, i) => (
                  <m.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
                    className="rounded-lg bg-brand-amber/10 px-3 py-1 text-xs font-semibold text-brand-amber-dark dark:text-brand-amber"
                  >
                    {tag}
                  </m.span>
                ))}
              </div>

              {/* Title — word-by-word light-year slip */}
              <h2 className="text-4xl lg:text-5xl xl:text-[3.25rem] font-extrabold leading-[1.06] text-brand-dark dark:text-white">
                <SlipWords text={project.title[lang]} baseDelay={0.05} />
              </h2>

              {/* Description */}
              <m.p
                className="text-base leading-relaxed text-brand-muted dark:text-white/50 max-w-sm"
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {project.description[lang]}
              </m.p>

              {/* CTA */}
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.4, ease: "easeOut" }}
              >
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-amber hover:text-brand-amber-dark transition-colors"
                  >
                    {sectionT.view[lang]}
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ) : (
                  <button className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-amber hover:text-brand-amber-dark transition-colors">
                    {sectionT.view[lang]}
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                )}
              </m.div>
            </m.div>
          </AnimatePresence>

          {/* Static footer: dot indicators + counter */}
          <div className="absolute bottom-12 left-14 right-14 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Project ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-7 h-2 bg-brand-amber"
                      : "w-2 h-2 bg-brand-dark/15 dark:bg-white/15 hover:bg-brand-dark/30 dark:hover:bg-white/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium tabular-nums text-brand-muted/50 dark:text-white/25">
              {String(activeIndex + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
