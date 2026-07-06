"use client";

import { useState } from "react";
import { Globe, Share2, Image, MessageCircle, Copy, Check } from "lucide-react";
import { Article } from "@/lib/types";
import { generateFacebookCaption, generateTwitterText, generateInstagramCaption, generateWhatsAppText } from "@/lib/utils";

interface SocialMediaCopyProps {
  article: Article;
}

const platforms = [
  { key: "facebook", label: "Facebook", icon: Globe, color: "text-blue-600" },
  { key: "twitter", label: "X / Twitter", icon: Share2, color: "text-sky-500" },
  { key: "instagram", label: "Instagram", icon: Image, color: "text-pink-600" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-600" },
];

export default function SocialMediaCopy({ article }: SocialMediaCopyProps) {
  const [active, setActive] = useState("facebook");
  const [copied, setCopied] = useState(false);

  const getContent = (key: string) => {
    switch (key) {
      case "facebook": return generateFacebookCaption(article.title, article.excerpt);
      case "twitter": return generateTwitterText(article.title, article.slug);
      case "instagram": return generateInstagramCaption(article.title, article.excerpt);
      case "whatsapp": return generateWhatsAppText(article.title, article.excerpt, article.slug);
      default: return "";
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
      <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">Share This Story</h3>
      <div className="flex gap-1.5 mb-4">
        {platforms.map((p) => (
          <button
            key={p.key}
            onClick={() => { setActive(p.key); setCopied(false); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              active === p.key
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            <p.icon size={13} />
            {p.label}
          </button>
        ))}
      </div>
      <div className="relative bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
        <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap pr-8">{getContent(active)}</p>
        <button
          onClick={() => handleCopy(getContent(active))}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-brand transition-colors"
          title="Copy"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
