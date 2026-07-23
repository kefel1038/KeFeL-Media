"use client";

import { useState, useCallback } from "react";
import { Link2, Check, Mail, MessageCircle } from "lucide-react";

interface ShareAnalyticsProps {
  articleSlug: string;
  articleTitle: string;
  articleExcerpt?: string;
}

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);

const PLATFORMS = [
  { name: "Facebook", icon: FacebookIcon, color: "hover:bg-blue-600/20 hover:text-blue-400", getUrl: (url: string, title: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: "X / Twitter", icon: XIcon, color: "hover:bg-sky-600/20 hover:text-sky-400", getUrl: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: "LinkedIn", icon: LinkedInIcon, color: "hover:bg-blue-700/20 hover:text-blue-400", getUrl: (url: string, title: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { name: "WhatsApp", icon: MessageCircle, color: "hover:bg-green-600/20 hover:text-green-400", getUrl: (url: string, title: string) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  { name: "Email", icon: Mail, color: "hover:bg-gray-600/20 hover:text-gray-300", getUrl: (url: string, title: string) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check this out: ${url}`)}` },
];

export default function ShareAnalytics({ articleSlug, articleTitle }: ShareAnalyticsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://kefelmedia.com/article/${articleSlug}`;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  }, [url]);

  return (
    <div className="flex items-center gap-1.5">
      {PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        return (
          <a
            key={platform.name}
            href={platform.getUrl(url, articleTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg text-gray-500 transition-colors ${platform.color}`}
            aria-label={`Share on ${platform.name}`}
          >
            <Icon size={16} />
          </a>
        );
      })}
      <button
        onClick={copyLink}
        className="p-2 rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
