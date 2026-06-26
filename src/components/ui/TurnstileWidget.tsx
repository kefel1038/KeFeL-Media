"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, opts: {
        sitekey: string;
        theme?: "light" | "dark" | "auto";
        callback?: (token: string) => void;
        ["expired-callback"]?: () => void;
      }) => void;
      reset: (container?: string | HTMLElement) => void;
      remove: (container?: string | HTMLElement) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function TurnstileWidget({ onVerify, onExpire, theme = "auto" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme,
          callback: (token: string) => onVerify(token),
          "expired-callback": () => onExpire?.(),
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (window.turnstile) {
        window.turnstile.remove(containerRef.current ?? undefined);
      }
    };
  }, [onVerify, onExpire, theme]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="turnstile-widget" />;
}
