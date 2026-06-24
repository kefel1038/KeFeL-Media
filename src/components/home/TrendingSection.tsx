import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTrendingArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";

export default function TrendingSection() {
  const trending = getTrendingArticles(3);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-brand rounded-full" />
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Trending News
          </h2>
        </div>
        <Link
          href="/latest"
          className="flex items-center gap-1 text-brand text-sm font-semibold hover:gap-2 transition-all"
        >
          See More <ArrowRight size={14} />
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((article) => (
          <ArticleCard key={article.id} article={article} variant="trending" />
        ))}
      </div>
    </section>
  );
}
