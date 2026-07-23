"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { LANGUAGE_CONFIG, type SupportedLanguage } from "@/lib/translation";

const languageOrder: SupportedLanguage[] = ["en", "sw", "ar", "fr", "pt"];

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGE_CONFIG[language];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe size={14} />
        <span className="uppercase">{current.flag} {language}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 animate-scale-up">
          {languageOrder.map((code) => {
            const config = LANGUAGE_CONFIG[code];
            const isActive = code === language;
            return (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "text-brand bg-brand/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{config.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{config.nativeName}</div>
                  <div className="text-[10px] text-gray-500">{config.name}</div>
                </div>
                {isActive && <Check size={14} className="text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
