"use client";

import { useState, useRef, useEffect } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}

export function LazySection({ children, className = "", rootMargin = "200px" }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : <div className="min-h-[200px]" />}
    </div>
  );
}
