import { getLatestArticles } from "@/data/articles";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

export default async function JustInStrip() {
  const articles = await getLatestArticles(6);
  if (articles.length === 0) return null;

  return (
    <section className="border-b border-[var(--card-border)] bg-[var(--card-bg)] transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center gap-4 py-3 overflow-x-auto scrollbar-hide category-ticker">
          <div className="flex-shrink-0 flex items-center gap-2 border-r border-[var(--card-border)] pr-4">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider whitespace-nowrap">
              Just In
            </span>
          </div>
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="flex-shrink-0 flex items-center gap-3 text-sm hover:text-brand-primary transition-colors group max-w-xs"
            >
              <CategoryBadge category={article.category} size="xs" />
              <span className="text-[var(--foreground)] font-medium truncate group-hover:text-brand-primary transition-colors">
                {article.title}
              </span>
              <span className="text-[var(--muted-text)] text-xs whitespace-nowrap">
                {formatRelativeTime(article.publishedAt)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
