"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LANGUAGE_CONFIG,
  type SupportedLanguage,
} from "@/lib/translation";

type Direction = "ltr" | "rtl";

interface TranslationContextState {
  language: SupportedLanguage;
  direction: Direction;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const TranslationContext = createContext<TranslationContextState>({
  language: "en",
  direction: "ltr",
  setLanguage: () => null,
  t: (_key, fallback) => fallback ?? _key,
});

const STORAGE_KEY = "kfl-lang";

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in LANGUAGE_CONFIG) return stored as SupportedLanguage;
  return "en";
}

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    setLanguageState(getStoredLanguage());
  }, []);

  useEffect(() => {
    const config = LANGUAGE_CONFIG[language];
    const dir: Direction = config.rtl ? "rtl" : "ltr";
    const root = document.documentElement;

    root.setAttribute("dir", dir);
    root.setAttribute("lang", language);

    if (config.rtl) {
      root.classList.add("rtl");
    } else {
      root.classList.remove("rtl");
    }
  }, [language]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return fallback ?? key;
    },
    [language]
  );

  const direction: Direction = LANGUAGE_CONFIG[language].rtl ? "rtl" : "ltr";

  const value = useMemo(
    () => ({ language, direction, setLanguage, t }),
    [language, direction, setLanguage, t]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}
