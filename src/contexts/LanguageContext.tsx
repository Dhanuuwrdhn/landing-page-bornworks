"use client";

import { createContext, ReactNode, useContext, useSyncExternalStore } from "react";

type Lang = "en" | "id";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
});

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("language-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("language-change", callback);
  };
}

function getLanguageSnapshot(): Lang {
  const saved = localStorage.getItem("lang");
  return saved === "id" ? "id" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore<Lang>(subscribe, getLanguageSnapshot, () => "en");

  const toggleLang = () => {
    const next = lang === "en" ? "id" : "en";
    localStorage.setItem("lang", next);
    window.dispatchEvent(new Event("language-change"));
  };

  const value: LanguageContextType = { lang, toggleLang };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
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
