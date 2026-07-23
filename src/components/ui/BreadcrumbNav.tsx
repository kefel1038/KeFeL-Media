import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-[var(--muted-text)] ${className}`}
    >
      <Link
        href="/"
        className="hover:text-brand-primary transition-colors flex items-center gap-1"
        aria-label="Home"
      >
        <Home size={12} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center gap-1.5">
          <ChevronRight size={10} className="text-[var(--muted-text)]/50" />
          {index === items.length - 1 ? (
            <span className="text-[var(--foreground)] truncate max-w-[200px]">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-brand-primary transition-colors capitalize">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
