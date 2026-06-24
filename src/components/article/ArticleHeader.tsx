"use client";

import Image from "next/image";
import { Clock, Calendar, Link2, Check } from "lucide-react";
import { useState } from "react";
import { Article } from "@/lib/types";
import { formatDate, readingTimeLabel } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

// Inline brand SVGs (lucide-react v4 removed these)
const FacebookIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface ArticleHeaderProps {
  article: Article;
}

const KEFELMEDIA_FACEBOOK = "https://www.facebook.com/profile.php?id=100063718801347";

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const [copied, setCopied] = useState(false);

  // Build the canonical article URL
  const getArticleUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://kefelmedia.com/article/${article.slug}`;
  };

  const handleFacebookShare = () => {
    const url = getArticleUrl();
    // Facebook Sharer — opens share dialog; posts will appear associated with the KeFeL Media page
    const shareUrl = `https://www.facebook.com/dialog/share?app_id=&href=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(KEFELMEDIA_FACEBOOK)}`;
    // Fallback to standard sharer which is simpler and always works without app_id
    const fallbackUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fallbackUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const handleXShare = () => {
    const url = getArticleUrl();
    const text = encodeURIComponent(`${article.title} — via @KefelMedia`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400,noopener,noreferrer"
    );
  };

  const handleLinkedinShare = () => {
    const url = getArticleUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=500,noopener,noreferrer"
    );
  };

  const handleCopyLink = async () => {
    const url = getArticleUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
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

  const shareButtons = [
    { Icon: FacebookIcon, label: "Facebook", color: "hover:bg-[#1877F2]", onClick: handleFacebookShare },
    { Icon: XIcon, label: "X / Twitter", color: "hover:bg-[#0F1419]", onClick: handleXShare },
    { Icon: LinkedinIcon, label: "LinkedIn", color: "hover:bg-[#0A66C2]", onClick: handleLinkedinShare },
    {
      Icon: copied ? Check : Link2,
      label: copied ? "Copied!" : "Copy Link",
      color: copied ? "bg-green-600 text-white" : "hover:bg-gray-700",
      onClick: handleCopyLink,
    },
  ];

  return (
    <header className="mb-8">
      {/* Category + Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <CategoryBadge category={article.category} size="md" />
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Headline */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 border-l-4 border-brand pl-4">
        {article.excerpt}
      </p>

      {/* Author + Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-3">
          <Image
            src={article.author.avatar}
            alt={article.author.name}
            width={44}
            height={44}
            className="rounded-full object-cover ring-2 ring-brand"
          />
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {article.author.name}
            </p>
            <p className="text-gray-500 text-xs">{article.author.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {readingTimeLabel(article.readingTime)}
          </span>
        </div>
      </div>

      {/* Social Share */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs text-gray-500 font-medium mr-1">Share:</span>
        {shareButtons.map(({ Icon, label, color, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            aria-label={`Share on ${label}`}
            title={label}
            className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white ${color} transition-all`}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>
    </header>
  );
}
