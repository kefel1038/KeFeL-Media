import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { getWeeklyHighlights } from "@/data/articles";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { formatRelativeTime, readingTimeLabel } from "@/lib/utils";

export default async function EditorsChoice() {
  const articles = await getWeeklyHighlights(3);
  if (articles.length === 0) return null;

  const [lead, ...rest] = articles;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-amber-500 rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white font-headline flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            Editor&apos;s Pick
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        <Link href={`/article/${lead.slug}`} className="group block">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <CategoryBadge category={lead.category} size="sm" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white leading-snug group-hover:text-brand transition-colors line-clamp-2 mb-1.5">
            {lead.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-2">
            {lead.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-300">{lead.author?.name}</span>
            <span>&middot;</span>
            <span>{formatRelativeTime(lead.publishedAt)}</span>
            <span>&middot;</span>
            <span>{readingTimeLabel(lead.readingTime)}</span>
          </div>
        </Link>

        <div className="flex flex-col gap-4">
          {rest.map((article, i) => (
            <div
              key={article.id}
              className={i < rest.length - 1 ? "pb-4 border-b border-zinc-800" : ""}
            >
              <Link href={`/article/${article.slug}`} className="group flex gap-4">
                <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <CategoryBadge category={article.category} size="xs" />
                  <h4 className="text-base font-bold text-white leading-snug mt-1 group-hover:text-brand transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <span>{article.author?.name}</span>
                    <span>&middot;</span>
                    <span>{formatRelativeTime(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
