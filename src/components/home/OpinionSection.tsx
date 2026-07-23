import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { getArticlesByCategory } from "@/data/articles";
import { formatRelativeTime } from "@/lib/utils";

export default async function OpinionSection() {
  const articles = await getArticlesByCategory("opinion", 3);
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gray-500 rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white font-headline flex items-center gap-2">
            <MessageSquare size={20} className="text-gray-400" />
            Opinion
          </h2>
        </div>
        <Link
          href="/opinion"
          className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-white hover:gap-2 transition-all"
        >
          See All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              {article.author?.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  {article.author?.name}
                </p>
                {article.author?.role && (
                  <p className="text-[10px] text-gray-500">{article.author.role}</p>
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug group-hover:text-brand transition-colors line-clamp-3 mb-2">
              {article.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
              {article.excerpt}
            </p>
            <div className="text-xs text-gray-500">
              {formatRelativeTime(article.publishedAt)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
