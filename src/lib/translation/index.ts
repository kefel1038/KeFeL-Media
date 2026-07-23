// Translation Service
// Manages multi-language translations for articles

import type { TranslatorOutput } from "@/lib/ai/types";

export type SupportedLanguage = "en" | "sw" | "ar" | "fr" | "pt";

export interface TranslationConfig {
  sourceLanguage: SupportedLanguage;
  targetLanguages: SupportedLanguage[];
  preserveTone: boolean;
  autoTranslate: boolean;
}

export interface Translation {
  id: string;
  articleId: string;
  language: SupportedLanguage;
  title: string;
  content: string;
  excerpt: string;
  status: "draft" | "review" | "published";
  translator: "ai" | "human";
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export const LANGUAGE_CONFIG: Record<SupportedLanguage, {
  name: string;
  nativeName: string;
  rtl: boolean;
  flag: string;
}> = {
  en: { name: "English", nativeName: "English", rtl: false, flag: "🇬🇧" },
  sw: { name: "Swahili", nativeName: "Kiswahili", rtl: false, flag: "🇰🇪" },
  ar: { name: "Arabic", nativeName: "العربية", rtl: true, flag: "🇸🇦" },
  fr: { name: "French", nativeName: "Français", rtl: false, flag: "🇫🇷" },
  pt: { name: "Portuguese", nativeName: "Português", rtl: false, flag: "🇧🇷" },
};

export class TranslationService {
  private config: TranslationConfig;

  constructor(config?: Partial<TranslationConfig>) {
    this.config = {
      sourceLanguage: "en",
      targetLanguages: ["sw", "ar", "fr", "pt"],
      preserveTone: true,
      autoTranslate: true,
      ...config,
    };
  }

  async translateArticle(
    article: {
      id: string;
      title: string;
      content: string;
      excerpt: string;
    },
    targetLanguage: SupportedLanguage
  ): Promise<Translation> {
    // In production, this would call the AI Translator Agent
    // For now, return a mock translation
    return {
      id: `trans-${Date.now()}`,
      articleId: article.id,
      language: targetLanguage,
      title: `[${LANGUAGE_CONFIG[targetLanguage].nativeName}] ${article.title}`,
      content: article.content,
      excerpt: article.excerpt,
      status: "draft",
      translator: "ai",
      confidence: 0.85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async translateToAllLanguages(
    article: {
      id: string;
      title: string;
      content: string;
      excerpt: string;
    }
  ): Promise<Translation[]> {
    const translations = await Promise.all(
      this.config.targetLanguages.map((lang) =>
        this.translateArticle(article, lang)
      )
    );
    return translations;
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return ["en", ...this.config.targetLanguages];
  }

  isRTL(language: SupportedLanguage): boolean {
    return LANGUAGE_CONFIG[language].rtl;
  }

  getLanguageConfig(language: SupportedLanguage) {
    return LANGUAGE_CONFIG[language];
  }
}

export const translationService = new TranslationService();
