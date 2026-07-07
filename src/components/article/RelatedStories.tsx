import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Article } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";

interface RelatedStoriesProps {
  article: Article;
  related: Article[];
}

export default function RelatedStories({ article, related }: RelatedStoriesProps) {
  if (related.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 md:h-7 bg-brand rounded-full" />
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-100 font-headline">
            Related Stories
          </h2>
        </div>
        <Link
          href={`/${article.category}`}
          className="flex items-center gap-1.5 text-brand text-sm font-semibold hover:gap-2 transition-all whitespace-nowrap"
        >
          More {article.category}
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {related.map((a) => (
          <ArticleCard key={a.id} article={a} variant="trending" />
        ))}
      </div>
    </section>
  );
}
