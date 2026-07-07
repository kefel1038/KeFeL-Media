import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTrendingArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";

export default async function TrendingSection() {
  const trending = await getTrendingArticles(3);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-brand rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white">Trending News</h2>
        </div>
        <Link href="/latest"
          className="flex items-center gap-1 text-brand text-sm font-semibold hover:gap-2 transition-all">
          See More <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((article) => <ArticleCard key={article.id} article={article} variant="trending" />)}
      </div>
    </section>
  );
}
