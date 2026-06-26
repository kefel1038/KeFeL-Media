"use client";

import { useEffect } from "react";

export default function PageViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const tracked = sessionStorage.getItem(`viewed_${slug}`);
    if (tracked) return;

    const timeout = setTimeout(() => {
      fetch("/api/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch(() => {});
      sessionStorage.setItem(`viewed_${slug}`, "1");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [slug]);

  return null;
}
