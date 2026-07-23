import Link from "next/link";
import { X } from "lucide-react";

interface TopicChipProps {
  label: string;
  href?: string;
  active?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function TopicChip({
  label,
  href,
  active = false,
  removable = false,
  onRemove,
  size = "md",
  className = "",
}: TopicChipProps) {
  const sizeClasses = {
    sm: "text-[11px] px-2.5 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  const baseClasses = `inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 ${sizeClasses[size]} ${
    active
      ? "bg-brand-primary text-white"
      : "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)] hover:border-brand-primary/50 hover:text-brand-primary"
  } ${className}`;

  const content = (
    <>
      <span className="truncate">{label}</span>
      {removable && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-0.5 rounded-full hover:bg-black/10 p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X size={10} />
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <span className={baseClasses}>
      {content}
    </span>
  );
}
