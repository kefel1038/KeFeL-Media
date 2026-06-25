import { Calendar, Clock, Eye, User } from "lucide-react";
import { Article } from "@/lib/types";
import { formatDate, readingTimeLabel } from "@/lib/utils";

interface ArticleMetadataProps {
  article: Article;
}

export default function ArticleMetadata({ article }: ArticleMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-6">
      <span className="inline-flex items-center gap-1.5 bg-brand/10 text-brand font-semibold px-2.5 py-1 rounded-full capitalize text-[11px]">
        {article.category}
      </span>
      <span className="flex items-center gap-1.5">
        <User size={12} />
        {article.author.name}
      </span>
      <span>·</span>
      <span className="flex items-center gap-1.5">
        <Calendar size={12} />
        {formatDate(article.publishedAt)}
      </span>
      <span>·</span>
      <span className="flex items-center gap-1.5">
        <Clock size={12} />
        {readingTimeLabel(article.readingTime)}
      </span>
      {(article.views ?? 0) > 0 && (
        <>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Eye size={12} />
            {(article.views ?? 0).toLocaleString()} views
          </span>
        </>
      )}
    </div>
  );
}
