import { getFeaturedArticle, getLatestArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";

export default async function HeroSection() {
  const featured = await getFeaturedArticle();
  if (!featured) return null;
  const sideArticles = (await getLatestArticles(8)).filter((a) => a.id !== featured.id).slice(0, 3);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
      <div className="lg:col-span-3">
        <ArticleCard article={featured} variant="hero" />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-4">
        {sideArticles.map((article, i) => (
          <div key={article.id}
            className={`${i < sideArticles.length - 1 ? "pb-4 border-b border-gray-200 dark:border-zinc-700" : ""}`}>
            <ArticleCard article={article} variant="side" />
          </div>
        ))}
      </div>
    </section>
  );
}
