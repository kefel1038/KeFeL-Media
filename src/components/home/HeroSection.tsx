import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getFeaturedArticle, getLatestArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { formatRelativeTime, readingTimeLabel } from "@/lib/utils";

export default async function HeroSection() {
  const featured = await getFeaturedArticle();
  if (!featured) return null;

  const sideArticles = (await getLatestArticles(8))
    .filter((a) => a.id !== featured.id)
    .slice(0, 2);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main hero — 7 cols */}
      <div className="lg:col-span-7">
        <Link href={`/article/${featured.slug}`} className="group block">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
              <div className="flex items-center gap-2 mb-3">
                <CategoryBadge category={featured.category} size="sm" />
                <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock size={10} />
                  {readingTimeLabel(featured.readingTime)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight group-hover:text-brand transition-colors line-clamp-3 mb-2">
                {featured.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2 mb-3 max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {featured.author?.avatar && (
                  <Image
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">{featured.author?.name}</span>
                <span className="text-gray-600">&middot;</span>
                <span>{formatRelativeTime(featured.publishedAt)}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary stories — 5 cols, stacked */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {sideArticles.map((article, i) => (
          <div
            key={article.id}
            className={i < sideArticles.length - 1 ? "pb-4 border-b border-zinc-800" : ""}
          >
            <ArticleCard article={article} variant="side" />
          </div>
        ))}
      </div>
    </section>
  );
}
