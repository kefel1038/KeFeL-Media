"use client";
import { Clock, Calendar, Link2, Check } from "lucide-react";
import { useState } from "react";
import { Article } from "@/lib/types";
import { formatDate, readingTimeLabel } from "@/lib/utils";

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

interface ArticleHeaderProps { article: Article; }

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== "undefined") return window.location.href;
    return `https://kefelmedia.com/article/${article.slug}`;
  };

  const handleFacebookShare = () => {
    const url = getArticleUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=600,height=400,noopener,noreferrer");
  };
  const handleXShare = () => {
    const url = getArticleUrl();
    const text = encodeURIComponent(`${article.title} — via @KefelMedia`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank", "width=600,height=400,noopener,noreferrer");
  };
  const handleLinkedinShare = () => {
    const url = getArticleUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "width=600,height=500,noopener,noreferrer");
  };
  const handleCopyLink = async () => {
    const url = getArticleUrl();
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

  const shareButtons = [
    { Icon: FacebookIcon, label: "Facebook", onClick: handleFacebookShare },
    { Icon: XIcon, label: "X / Twitter", onClick: handleXShare },
    { Icon: LinkedinIcon, label: "LinkedIn", onClick: handleLinkedinShare },
    { Icon: copied ? Check : Link2, label: copied ? "Copied!" : "Copy Link", onClick: handleCopyLink },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-border">
      <div className="flex items-center gap-3">
        {article.author.avatar ? (
          <img src={article.author.avatar} alt={article.author.name} width={44} height={44}
            className="rounded-full object-cover ring-2 ring-brand w-11 h-11" />
        ) : (
          <div className="w-11 h-11 rounded-full ring-2 ring-brand bg-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
            {article.author.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-fg-heading text-sm">{article.author.name}</p>
          <p className="text-fg-subtle text-xs">{article.author.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-fg-subtle">
        <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(article.publishedAt)}</span>
        <span className="flex items-center gap-1.5"><Clock size={13} />{readingTimeLabel(article.readingTime)}</span>
      </div>
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <span className="text-xs text-fg-subtle font-bold mr-1">Share:</span>
        {shareButtons.map(({ Icon, label, onClick }) => (
          <button key={label} onClick={onClick} aria-label={`Share on ${label}`} title={label}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-fg-muted hover:text-white hover:bg-brand transition-all">
            <Icon size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}
