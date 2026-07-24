"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Script from "next/script";
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
  ready: boolean;
}

const TranslationContext = createContext<TranslationContextState>({
  language: "en",
  direction: "ltr",
  setLanguage: () => null,
  t: (_key, fallback) => fallback ?? _key,
  ready: false,
});

const STORAGE_KEY = "kfl-lang";

const GOOGLE_TRANSLATE_ID = "google_translate_element";

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in LANGUAGE_CONFIG) return stored as SupportedLanguage;
  return "en";
}

function getGoogleLangCode(lang: SupportedLanguage): string {
  const map: Record<SupportedLanguage, string> = {
    en: "en",
    sw: "sw",
    ar: "ar",
    fr: "fr",
    pt: "pt",
  };
  return map[lang] || "en";
}

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLanguageState(getStoredLanguage());
    setReady(true);
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

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        const ctor = window.google.translate.TranslateElement;
        new ctor(
          {
            pageLanguage: "en",
            includedLanguages: "en,sw,ar,fr,pt",
            layout: ctor.InlineLayout?.SIMPLE ?? "SIMPLE",
            autoDisplay: false,
          },
          GOOGLE_TRANSLATE_ID
        );
      }
    };
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);

    if (typeof window !== "undefined") {
      const select = document.querySelector(
        "#google_translate_element select"
      ) as HTMLSelectElement | null;
      if (select) {
        const target = getGoogleLangCode(lang);
        select.value = target;
        select.dispatchEvent(new Event("change"));
      }
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return fallback ?? key;
    },
    [language]
  );

  const direction: Direction = LANGUAGE_CONFIG[language].rtl ? "rtl" : "ltr";

  const value = useMemo(
    () => ({ language, direction, setLanguage, t, ready }),
    [language, direction, setLanguage, t, ready]
  );

  return (
    <TranslationContext.Provider value={value}>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div
        id={GOOGLE_TRANSLATE_ID}
        className="fixed bottom-4 left-4 z-[9999] opacity-0 pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx)
    throw new Error(
      "useTranslation must be used within TranslationProvider"
    );
  return ctx;
}
