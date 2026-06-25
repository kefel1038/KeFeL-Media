import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getArticlesByCategory, getLatestArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";

interface Props {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES = [
  "uganda", "africa", "world", "business", "technology",
  "entertainment", "sports", "opinion", "latest",
];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  const title = cat?.label ?? "Latest News";
  return {
    title: `${title} News`,
    description: cat?.description ?? "Browse the latest news from KeFeL Media",
    openGraph: {
      title: `${title} | KeFeL Media`,
      description: cat?.description ?? "Latest news from KeFeL Media",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) notFound();

  const cat = getCategoryBySlug(category);
  const articles =
    category === "latest"
      ? await getLatestArticles(20)
      : await getArticlesByCategory(category);

  const [hero, ...rest] = articles;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-zinc-700">
        <div className={`w-3 h-8 rounded ${cat?.color ?? "bg-brand"}`} />
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            {cat?.label ?? "Latest News"}
          </h1>
          {cat?.description && (
            <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
          )}
        </div>
      </div>

      {hero && (
        <div className="mb-10">
          <ArticleCard article={hero} variant="hero" />
        </div>
      )}

      <hr className="border-gray-200 dark:border-zinc-700 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div>
          {rest.length > 0 ? (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-gray-900 dark:bg-white rounded-full" />
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                  Latest {cat?.label ?? "News"}
                </h2>
              </div>
              <div className="space-y-5">
                {rest.map((article, i) => (
                  <div
                    key={article.id}
                    className={`${i < rest.length - 1 ? "pb-5 border-b border-gray-200 dark:border-zinc-700" : ""}`}
                  >
                    <ArticleCard article={article} variant="list" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            !hero && (
              <p className="text-gray-500 text-center py-12">
                No articles found in this category yet.
              </p>
            )
          )}
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
