import { FileText, Search, AlertCircle, Newspaper } from "lucide-react";

interface EmptyStateProps {
  variant?: "no-articles" | "no-results" | "error" | "coming-soon";
  title?: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

const icons = {
  "no-articles": Newspaper,
  "no-results": Search,
  "error": AlertCircle,
  "coming-soon": FileText,
};

const defaultContent = {
  "no-articles": {
    title: "No Articles Yet",
    description: "We're working on bringing you the latest stories. Check back soon.",
  },
  "no-results": {
    title: "No Results Found",
    description: "We couldn't find any results matching your search. Try different keywords.",
  },
  "error": {
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again later.",
  },
  "coming-soon": {
    title: "Coming Soon",
    description: "This section is under development. Stay tuned for updates.",
  },
};

export default function EmptyState({
  variant = "no-articles",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const Icon = icons[variant];
  const content = defaultContent[variant];

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center mb-5">
        <Icon size={28} className="text-[var(--muted-text)]" />
      </div>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 font-headline">
        {title || content.title}
      </h3>
      <p className="text-sm text-[var(--muted-text)] max-w-md leading-relaxed">
        {description || content.description}
      </p>
      {action && (
        <a
          href={action.href}
          className="mt-6 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
