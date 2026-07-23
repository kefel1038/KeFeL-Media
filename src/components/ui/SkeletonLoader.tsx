import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  variant?: "article-card" | "article-list" | "hero" | "sidebar" | "text" | "image" | "avatar" | "badge";
  className?: string;
  count?: number;
}

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded", className)} />;
}

export default function SkeletonLoader({ variant = "article-card", className, count = 1 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  if (variant === "hero") {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-5 gap-6", className)}>
        <div className="lg:col-span-3">
          <SkeletonLine className="aspect-video rounded-xl mb-4" />
          <SkeletonLine className="h-6 w-3/4 mb-2" />
          <SkeletonLine className="h-4 w-full mb-1" />
          <SkeletonLine className="h-4 w-2/3" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          {items.map((_, i) => (
            <div key={i} className="flex gap-4">
              <SkeletonLine className="w-28 h-28 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonLine className="h-3 w-16" />
                <SkeletonLine className="h-4 w-full" />
                <SkeletonLine className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "article-card") {
    return (
      <div className={cn("space-y-6", className)}>
        {items.map((_, i) => (
          <div key={i} className="flex gap-4">
            <SkeletonLine className="w-28 h-20 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-3 w-16" />
              <SkeletonLine className="h-5 w-full" />
              <SkeletonLine className="h-4 w-3/4" />
              <SkeletonLine className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "article-list") {
    return (
      <div className={cn("space-y-5", className)}>
        {items.map((_, i) => (
          <div key={i} className="pb-5 border-b border-[var(--card-border)]">
            <div className="flex gap-4">
              <SkeletonLine className="w-32 h-24 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonLine className="h-3 w-16" />
                <SkeletonLine className="h-5 w-full" />
                <SkeletonLine className="h-4 w-4/5" />
                <SkeletonLine className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="bg-[var(--card-bg)] rounded border border-[var(--card-border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--card-border)]">
            <SkeletonLine className="h-4 w-32" />
          </div>
          <div className="divide-y divide-[var(--card-border)]">
            {items.map((_, i) => (
              <div key={i} className="flex gap-3 p-4">
                <SkeletonLine className="w-20 h-20 rounded flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <SkeletonLine className="h-4 w-full" />
                  <SkeletonLine className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((_, i) => (
          <SkeletonLine key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  if (variant === "image") {
    return <SkeletonLine className={cn("rounded-xl", className)} />;
  }

  if (variant === "avatar") {
    return <SkeletonLine className={cn("rounded-full", className)} />;
  }

  if (variant === "badge") {
    return <SkeletonLine className={cn("h-6 w-20 rounded", className)} />;
  }

  return <SkeletonLine className={cn("h-4 w-full", className)} />;
}
