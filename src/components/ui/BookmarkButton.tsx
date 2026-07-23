"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  articleId: string;
  initialBookmarked?: boolean;
  className?: string;
}

export default function BookmarkButton({
  articleId: _articleId,
  initialBookmarked = false,
  className = "",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [animating, setAnimating] = useState(false);

  const toggle = async () => {
    setAnimating(true);
    setBookmarked(!bookmarked);
    // TODO: API call to toggle bookmark
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 text-sm transition-all duration-200 ${
        bookmarked
          ? "text-brand-primary font-semibold"
          : "text-[var(--muted-text)] hover:text-brand-primary"
      } ${className}`}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this article"}
    >
      <span className={animating ? "animate-scale-up" : ""}>
        {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </span>
      <span className="hidden sm:inline">
        {bookmarked ? "Saved" : "Save"}
      </span>
    </button>
  );
}
