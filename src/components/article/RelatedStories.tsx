import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Article } from "@/lib/types";
import { getRelatedArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";

interface RelatedStoriesProps { article: Article; }

export default async function RelatedStories({ article }: RelatedStoriesProps) {
  const related = await getRelatedArticles(article, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-brand rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Related Stories</h2>
        </div>
        <Link href={`/${article.category}`}
          className="flex items-center gap-1 text-brand text-sm font-semibold hover:gap-2 transition-all">
          More {article.category} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((a) => <ArticleCard key={a.id} article={a} variant="trending" />)}
      </div>
    </section>
  );
}
