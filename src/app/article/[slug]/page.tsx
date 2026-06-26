import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getRelatedArticles } from "@/data/articles";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleHighlights from "@/components/article/ArticleHighlights";
import ArticleMetadata from "@/components/article/ArticleMetadata";
import SocialMediaCopy from "@/components/article/SocialMediaCopy";
import RelatedStories from "@/components/article/RelatedStories";
import Sidebar from "@/components/layout/Sidebar";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { formatDate, readingTimeLabel, generateMetaDescription } from "@/lib/utils";
import { Calendar, Clock, Share2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: generateMetaDescription(article.excerpt),
    openGraph: {
      title: article.title,
      description: generateMetaDescription(article.excerpt),
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: generateMetaDescription(article.excerpt),
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: generateMetaDescription(article.excerpt),
    image: article.image,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: "KeFeL Media",
      logo: { "@type": "ImageObject", url: "https://kefelmedia.com/logo.png" },
    },
  };

  return (
    <>
      <PageViewTracker slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {/* === Mobile Sticky Share Bar === */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 px-4 py-2.5 flex items-center justify-between md:hidden shadow-lg">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={13} />
            <span>{formatDate(article.publishedAt)}</span>
            <span className="mx-1">·</span>
            <Clock size={13} />
            <span>{readingTimeLabel(article.readingTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 size={14} className="text-brand" />
            <span className="text-xs font-semibold text-brand">Share</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="mb-4">
              <CategoryBadge category={article.category} size="md" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-4 font-headline">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-5 border-l-4 border-brand pl-4 font-medium">
              {article.excerpt}
            </p>
            <ArticleMetadata article={article} />
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-xl shadow-md aspect-video lg:aspect-[4/3] w-full bg-gray-200 dark:bg-zinc-800">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover absolute inset-0 hover:scale-[1.02] transition-transform duration-500 ease-in-out"
              />
              <span className="absolute top-3 left-3 backdrop-blur-md bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded select-none">
                {article.featured ? "EXCLUSIVE" : article.category.toUpperCase()}
              </span>
            </div>
            {(article.imageCaption || article.imageCredit) && (
              <p className="text-right text-gray-500 dark:text-gray-400 text-xs italic mt-2">
                {article.imageCaption}
                {article.imageCaption && article.imageCredit && <span>, </span>}
                {article.imageCredit && <span className="not-italic font-medium">{article.imageCredit}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <article className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-10 mb-8">
            <ArticleHighlights items={article.highlights ?? []} />
            <ArticleBody
              content={article.content}
              secondaryImage={article.secondaryImage}
              secondaryImageCaption={article.secondaryImageCaption}
            />
            <div className="mt-10">
              <ArticleHeader article={article} />
            </div>
            <SocialMediaCopy article={article} />
            <RelatedStories article={article} related={related} />
          </article>
          <aside className="pt-2">
            <Sidebar />
          </aside>
        </div>

        <div className="h-16 md:h-0" />
      </div>
    </>
  );
}
