import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesByAuthor, getAllArticles } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";
import { formatDate } from "@/lib/utils";
import { Calendar, FileText } from "lucide-react";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const displayName = name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const articles = await getArticlesByAuthor(displayName, 1);
  if (articles.length === 0) return { title: "Author Not Found" };

  return {
    title: `${articles[0].author.name} — Author Profile | KeFeL Media`,
    description: `Articles by ${articles[0].author.name}, ${articles[0].author.role} at KeFeL Media.`,
    openGraph: {
      title: `${articles[0].author.name} — KeFeL Media`,
      description: `Read the latest articles by ${articles[0].author.name}.`,
      type: "profile",
    },
  };
}

export async function generateStaticParams() {
  const all = await getAllArticles();
  const names = [...new Set(all.map((a) => a.author.name))];
  return names.map((n) => ({
    name: n.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params;
  const displayName = name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const articles = await getArticlesByAuthor(displayName);

  if (articles.length === 0) notFound();

  const author = articles[0].author;
  const totalViews = articles.reduce((sum, a) => sum + (a.views ?? 0), 0);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Author header */}
      <div className="max-w-3xl mx-auto mb-8 md:mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-brand/20"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-brand/20 bg-brand flex items-center justify-center text-white font-bold text-2xl md:text-3xl">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white font-headline">
              {author.name}
            </h1>
            <p className="text-sm md:text-base text-zinc-400 mt-1">{author.role}</p>
            {author.bio && (
              <p className="text-sm md:text-base text-zinc-400 mt-3 max-w-xl leading-relaxed">
                {author.bio}
              </p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <FileText size={13} />
                {articles.length} {articles.length === 1 ? "article" : "articles"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Latest: {formatDate(articles[0].publishedAt)}
              </span>
              {totalViews > 0 && (
                <span className="flex items-center gap-1.5">
                  {totalViews.toLocaleString()} total views
                </span>
              )}
            </div>
            {articles[0].author.avatar && (
              <Link
                href={`/article/${articles[0].slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline mt-3"
              >
                View latest article
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="border-t border-zinc-800 pt-8 md:pt-10">
        <h2 className="text-lg md:text-xl font-black text-white mb-6 md:mb-8 font-headline">
          Articles by {author.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="trending" />
          ))}
        </div>
      </div>
    </div>
  );
}
