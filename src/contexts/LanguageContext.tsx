"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "id";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "id") setLang(saved);
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "id" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

/* ── Translation helper ──────────────────────────────── */
type Translations = Record<string, { en: string; id: string }>;

export function useT(translations: Translations) {
  const { lang } = useLang();
  return (key: string) => translations[key]?.[lang] ?? key;
}
