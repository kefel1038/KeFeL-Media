"use client";

import { useState, useCallback } from "react";
import { Bookmark, Share2, Check, BookmarkCheck } from "lucide-react";

interface CardActionsProps {
  articleSlug: string;
  articleTitle: string;
  className?: string;
}

export default function CardActions({ articleSlug, articleTitle, className = "" }: CardActionsProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleBookmark = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked((prev) => !prev);
  }, []);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `https://kefelmedia.com/article/${articleSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: articleTitle, url });
        return;
      } catch { /* cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch { /* silent */ }
  }, [articleSlug, articleTitle]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleBookmark}
        className="p-1.5 rounded-full text-gray-500 hover:text-brand hover:bg-brand/10 transition-colors"
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
      >
        {bookmarked ? <BookmarkCheck size={14} className="text-brand" /> : <Bookmark size={14} />}
      </button>
      <button
        onClick={handleShare}
        className="p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Share article"
      >
        {shared ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
      </button>
    </div>
  );
}
