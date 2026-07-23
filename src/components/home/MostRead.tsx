import { getTrendingArticles } from "@/data/articles";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

export default async function MostRead() {
  const articles = await getTrendingArticles(5);
  if (articles.length === 0) return null;

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] overflow-hidden transition-colors duration-300">
      <div className="px-5 py-4 border-b border-[var(--card-border)]">
        <h2 className="text-base font-black text-[var(--foreground)] flex items-center gap-2 uppercase tracking-wider font-headline">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          Most Read
        </h2>
      </div>
      <div className="divide-y divide-[var(--card-border)]">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="flex items-start gap-3 p-4 hover:bg-[var(--card-bg)] hover:shadow-sm transition-all duration-200 group"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-black text-sm flex items-center justify-center">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-sans text-sm font-bold text-[var(--foreground)] line-clamp-2 group-hover:text-brand-primary transition-colors leading-tight">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <CategoryBadge category={article.category} size="xs" />
                <span className="text-[var(--muted-text)] text-[11px]">
                  {formatRelativeTime(article.publishedAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
