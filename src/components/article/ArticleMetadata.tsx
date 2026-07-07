import { Calendar, Clock, Eye } from "lucide-react";
import { Article } from "@/lib/types";
import { formatDate, readingTimeLabel, stripHtml } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface ArticleMetadataProps {
  article: Article;
  showCategory?: boolean;
}

export default function ArticleMetadata({ article, showCategory = true }: ArticleMetadataProps) {
  const wordCount = stripHtml(article.content || "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400">
      {showCategory && <CategoryBadge category={article.category} size="sm" />}
      <span className="flex items-center gap-1.5">
        <Calendar size={12} />
        {formatDate(article.publishedAt)}
      </span>
      <span className="hidden sm:inline text-zinc-500">·</span>
      <span className="hidden sm:flex items-center gap-1.5">
        <Clock size={12} />
        {readingTimeLabel(readingTime)}
      </span>
      {(article.views ?? 0) > 0 && (
        <>
          <span className="text-zinc-500">·</span>
          <span className="flex items-center gap-1.5">
            <Eye size={12} />
            {(article.views ?? 0).toLocaleString()} views
          </span>
        </>
      )}
    </div>
  );
}
