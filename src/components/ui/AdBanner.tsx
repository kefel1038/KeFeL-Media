"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AdBannerProps {
  position: "top" | "inline" | "sidebar" | "bottom";
  className?: string;
}

const AD_CONFIGS = {
  top: { height: "h-24 md:h-32", label: "Advertisement" },
  inline: { height: "h-32 md:h-40", label: "Sponsored" },
  sidebar: { height: "h-64", label: "Advertisement" },
  bottom: { height: "h-24 md:h-32", label: "Advertisement" },
};

export default function AdBanner({ position, className = "" }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [adReady, setAdReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAdReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  const config = AD_CONFIGS[position];

  return (
    <div
      className={`relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden ${config.height} ${className}`}
    >
      {adReady ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-1 bg-zinc-700 rounded mb-3 mx-auto" />
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">{config.label}</p>
              <div className="w-24 h-1 bg-zinc-700 rounded mt-2 mx-auto" />
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 skeleton-shimmer" />
      )}

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 rounded text-gray-600 hover:text-gray-400 hover:bg-zinc-800 transition-colors z-10"
        aria-label="Dismiss ad"
      >
        <X size={12} />
      </button>

      <span className="absolute bottom-1.5 right-2 text-[8px] text-gray-700 uppercase tracking-wider z-10">
        Ad
      </span>
    </div>
  );
}

export function InArticleAd() {
  return (
    <div className="my-8">
      <AdBanner position="inline" />
    </div>
  );
}

export function StickyAd() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      <AdBanner position="bottom" className="rounded-none border-x-0 border-b-0" />
    </div>
  );
}
