import { getArticlesByCategory } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryBySlug } from "@/data/categories";

interface CategorySectionProps {
  categorySlug: string;
  limit?: number;
}

export default async function CategorySection({ categorySlug, limit = 4 }: CategorySectionProps) {
  const articles = await getArticlesByCategory(categorySlug, limit);
  if (articles.length === 0) return null;

  const category = getCategoryBySlug(categorySlug);

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: category?.accentColor || "#D32F2F" }}
          />
          <h2 className="text-xl md:text-2xl font-black text-[var(--foreground)] font-headline">
            {category?.label || categorySlug}
          </h2>
        </div>
        <Link
          href={`/${categorySlug}`}
          className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
          style={{ color: category?.accentColor || "#D32F2F" }}
        >
          See All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="trending" />
        ))}
      </div>
    </section>
  );
}
