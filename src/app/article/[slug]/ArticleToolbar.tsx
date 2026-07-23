"use client";

import { useState, useEffect, useCallback } from "react";
import { Type, Minus, Plus, BookmarkPlus, Share2, ChevronUp, ChevronDown } from "lucide-react";

const FONT_SIZE_KEY = "kfl-font-size";
const MIN_SIZE = 14;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 18;

export function ArticleToolbar() {
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);
  const [showTOC, setShowTOC] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    if (stored) setFontSize(Number(stored));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--article-font-size", `${fontSize}px`);
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    const headings = document.querySelectorAll(".urban-rich-text h2, .urban-rich-text h3");
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const decrease = useCallback(() => {
    setFontSize((s) => Math.max(s - 2, MIN_SIZE));
  }, []);

  const increase = useCallback(() => {
    setFontSize((s) => Math.min(s + 2, MAX_SIZE));
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const headings = typeof document !== "undefined"
    ? Array.from(document.querySelectorAll(".urban-rich-text h2, .urban-rich-text h3"))
    : [];

  return (
    <>
      {/* Sticky toolbar - appears after 200px scroll */}
      <FloatingToolbar
        onIncrease={increase}
        onDecrease={decrease}
        fontSize={fontSize}
        minSize={MIN_SIZE}
        maxSize={MAX_SIZE}
        onScrollTop={scrollToTop}
        onToggleTOC={() => setShowTOC(!showTOC)}
        headingsCount={headings.length}
      />

      {/* Slide-in Table of Contents */}
      {showTOC && (
        <TOCPanel
          headings={headings}
          activeId={activeHeading}
          onClose={() => setShowTOC(false)}
        />
      )}
    </>
  );
}

function FloatingToolbar({
  onIncrease,
  onDecrease,
  fontSize,
  minSize,
  maxSize,
  onScrollTop,
  onToggleTOC,
  headingsCount,
}: {
  onIncrease: () => void;
  onDecrease: () => void;
  fontSize: number;
  minSize: number;
  maxSize: number;
  onScrollTop: () => void;
  onToggleTOC: () => void;
  headingsCount: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2 shadow-xl">
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <span className="text-[10px] text-gray-400 mr-1"><Type size={12} /></span>
          <button
            onClick={onDecrease}
            disabled={fontSize <= minSize}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
            aria-label="Decrease font size"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs text-gray-300 w-6 text-center font-mono">{fontSize}</span>
          <button
            onClick={onIncrease}
            disabled={fontSize >= maxSize}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
            aria-label="Increase font size"
          >
            <Plus size={14} />
          </button>
        </div>

        {headingsCount > 2 && (
          <button
            onClick={onToggleTOC}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Table of contents"
          >
            <ChevronDown size={16} />
          </button>
        )}

        <button
          onClick={onScrollTop}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Back to top"
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
}

function TOCPanel({
  headings,
  activeId,
  onClose,
}: {
  headings: Element[];
  activeId: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed right-0 top-0 h-full w-72 z-50 animate-slide-left" style={{ top: "var(--header-height, 80px)" }}>
      <div className="h-full bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white font-serif uppercase tracking-wider">
            In this article
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            aria-label="Close table of contents"
          >
            ✕
          </button>
        </div>
        <nav className="space-y-1">
          {headings.map((heading, i) => {
            const id = heading.id || `heading-${i}`;
            const isH3 = heading.tagName === "H3";
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={onClose}
                className={`block py-1.5 text-sm transition-colors ${
                  isH3 ? "ps-4" : "ps-0"
                } ${
                  isActive
                    ? "text-brand font-medium"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {heading.textContent}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
