"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Article } from "@/lib/types";

export function ShareButton({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `https://kefelmedia.com/article/${article.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
        return;
      } catch { /* user cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
