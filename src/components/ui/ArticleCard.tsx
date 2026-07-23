import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Article } from "@/lib/types";
import { formatRelativeTime, readingTimeLabel } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import CardActions from "@/components/ui/CardActions";

type CardVariant = "hero" | "side" | "trending" | "list" | "compact";

interface ArticleCardProps {
  article: Article;
  variant?: CardVariant;
  className?: string;
}

export default function ArticleCard({
  article,
  variant = "list",
  className = "",
}: ArticleCardProps) {
  if (variant === "hero") {
    return (
      <article className={`group block ${className}`}>
        <Link href={`/article/${article.slug}`} className="block">
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <CategoryBadge category={article.category} size="sm" />
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                <Clock size={10} />
                {readingTimeLabel(article.readingTime)}
              </span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-zinc-100 leading-tight group-hover:text-brand transition-colors mb-3 line-clamp-3">
            {article.title}
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed mb-3 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="flex items-center gap-1.5">
              {article.author.avatar && (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={22}
                  height={22}
                  className="rounded-full object-cover"
                />
              )}
              <span className="font-medium text-zinc-400">
                {article.author.name}
              </span>
            </div>
            <span>•</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "side") {
    return (
      <article className={`group ${className}`}>
        <Link
          href={`/article/${article.slug}`}
          className="flex gap-4"
        >
          <div className="flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden relative">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 224px, 112px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CategoryBadge category={article.category} size="xs" />
            <h3 className="text-lg font-bold text-zinc-100 leading-snug mt-1 group-hover:text-brand transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mt-1 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-1 mt-2 text-zinc-500 text-xs">
              <Clock size={11} />
              <span>{readingTimeLabel(article.readingTime)}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "trending") {
    return (
      <article className={`group block ${className}`}>
        <Link href={`/article/${article.slug}`} className="block">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <CategoryBadge category={article.category} size="xs" />
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                <Clock size={9} />
                {readingTimeLabel(article.readingTime)}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-black text-zinc-100 leading-snug group-hover:text-brand transition-colors line-clamp-2 mb-1.5">
            {article.title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <Clock size={11} />
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={`group ${className}`}>
        <Link
          href={`/article/${article.slug}`}
          className="flex gap-3"
        >
          <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden relative">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="112px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 group-hover:text-brand transition-colors leading-snug">
              {article.title}
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1">
              {formatRelativeTime(article.publishedAt)}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={`group ${className}`}>
      <Link
        href={`/article/${article.slug}`}
        className="flex gap-4"
      >
        <div className="flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden relative">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 224px, 112px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CategoryBadge category={article.category} size="xs" />
              <h3 className="text-xl font-bold text-zinc-100 leading-snug mt-1 group-hover:text-brand transition-colors line-clamp-2">
                {article.title}
              </h3>
            </div>
            <CardActions articleSlug={article.slug} articleTitle={article.title} />
          </div>
          <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
            <span>{article.author.name}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {readingTimeLabel(article.readingTime)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
