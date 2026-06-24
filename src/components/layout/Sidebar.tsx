import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getSidebarLatest, getWeeklyHighlights } from "@/data/articles";
import { formatRelativeTime } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

export default async function Sidebar() {
  const latestArticles = await getSidebarLatest(4);
  const weeklyHighlights = await getWeeklyHighlights(4);

  return (
    <aside className="space-y-6">
      {/* Latest News Widget */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
          <h2 className="font-bold text-base text-gray-900 dark:text-white">Latest News</h2>
          <Link
            href="/latest"
            className="text-brand text-xs font-semibold hover:underline"
          >
            See All →
          </Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <CategoryBadge category={article.category} size="xs" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mt-1 group-hover:text-brand transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-xs">
                  <Clock size={11} />
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly Highlights Widget */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
          <h2 className="font-bold text-base text-gray-900 dark:text-white">
            Weekly Highlights
          </h2>
          <Link
            href="/latest"
            className="text-brand text-xs font-semibold hover:underline"
          >
            More →
          </Link>
        </div>

        {/* Top 2 image cards */}
        <div className="grid grid-cols-2 gap-2 p-4">
          {weeklyHighlights.slice(0, 2).map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 50vw, 150px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <CategoryBadge category={article.category} size="xs" />
                </div>
              </div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand transition-colors leading-snug">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Text-only list */}
        <div className="divide-y divide-gray-100 dark:divide-zinc-800 px-4 pb-4">
          {weeklyHighlights.slice(2, 4).map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="flex items-start gap-2 py-3 group"
            >
              <span className="text-brand font-black text-lg leading-none mt-0.5">•</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                  <Clock size={10} />
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gradient-to-br from-brand/10 to-orange-100 dark:from-brand/20 dark:to-zinc-800 rounded-2xl border border-brand/20 p-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Advertisement
        </p>
        <div className="bg-white/50 dark:bg-white/5 rounded-xl p-6">
          <p className="text-brand font-bold text-sm">Advertise with KeFeL Media</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
            Reach millions of African readers
          </p>
          <Link
            href="/advertise"
            className="inline-block mt-3 bg-brand text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </aside>
  );
}
