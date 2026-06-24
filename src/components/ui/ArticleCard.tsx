import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Article } from "@/lib/types";
import { formatRelativeTime, readingTimeLabel, truncate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

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
      <Link href={`/article/${article.slug}`} className={`group block ${className}`}>
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 65vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <CategoryBadge category={article.category} size="sm" />
            <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock size={10} />
              {readingTimeLabel(article.readingTime)}
            </span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-brand transition-colors mb-3">
          {article.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
          {truncate(article.excerpt, 160)}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            {article.author.avatar && (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
            )}
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {article.author.name}
            </span>
          </div>
          <span>•</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  if (variant === "side") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className={`flex gap-4 group ${className}`}
      >
        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="96px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} size="xs" />
          <h3 className="font-bold text-gray-900 dark:text-white leading-snug mt-1 group-hover:text-brand transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mt-1 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs">
            <Clock size={11} />
            <span>{readingTimeLabel(article.readingTime)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "trending") {
    return (
      <Link href={`/article/${article.slug}`} className={`group block ${className}`}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <CategoryBadge category={article.category} size="xs" />
            <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock size={9} />
              {readingTimeLabel(article.readingTime)}
            </span>
          </div>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand transition-colors line-clamp-2 mb-1.5">
          {article.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Clock size={11} />
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className={`flex gap-3 group ${className}`}
      >
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden relative">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="56px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">
            {formatRelativeTime(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  // Default: list variant
  return (
    <Link
      href={`/article/${article.slug}`}
      className={`flex gap-4 group ${className}`}
    >
      <div className="flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden relative">
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
        <h3 className="font-bold text-gray-900 dark:text-white leading-snug mt-1 group-hover:text-brand transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-1">
          {truncate(article.excerpt, 80)}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
          <span>{article.author.name}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {readingTimeLabel(article.readingTime)}
          </span>
        </div>
      </div>
    </Link>
  );
}
