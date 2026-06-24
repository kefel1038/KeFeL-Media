import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";

export default async function LatestFeed() {
  const latest = (await getLatestArticles(8)).slice(3); // skip first 3 (used in hero/sidebar)

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gray-900 dark:bg-white rounded-full" />
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Latest Stories
          </h2>
        </div>
        <Link
          href="/latest"
          className="flex items-center gap-1 text-brand text-sm font-semibold hover:gap-2 transition-all"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Article Feed */}
      <div className="space-y-5">
        {latest.map((article, i) => (
          <div
            key={article.id}
            className={`${
              i < latest.length - 1
                ? "pb-5 border-b border-gray-200 dark:border-zinc-700"
                : ""
            }`}
          >
            <ArticleCard article={article} variant="list" />
          </div>
        ))}
      </div>
    </section>
  );
}
