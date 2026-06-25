import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/data/articles";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleBody from "@/components/article/ArticleBody";
import RelatedStories from "@/components/article/RelatedStories";
import Sidebar from "@/components/layout/Sidebar";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { formatDate, readingTimeLabel } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "KeFeL Media",
      logo: {
        "@type": "ImageObject",
        url: "https://kefelmedia.com/logo.png",
      },
    },
  };

  const imageUrl = article.image;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {/* === Split-Screen Hero === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          {/* Left: Content (7 cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="mb-4">
              <CategoryBadge category={article.category} size="md" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-5 border-l-4 border-brand pl-4">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {article.author.avatar ? (
                  <img src={article.author.avatar} alt={article.author.name} width={28} height={28}
                    className="rounded-full object-cover w-7 h-7" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {article.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-gray-900 dark:text-white">{article.author.name}</span>
              </div>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} />{readingTimeLabel(article.readingTime)}</span>
            </div>
          </div>

          {/* Right: Image (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-xl shadow-md aspect-video lg:aspect-[4/3] w-full bg-gray-200 dark:bg-zinc-800 animate-pulse">
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover absolute inset-0 hover:scale-[1.02] transition-transform duration-500 ease-in-out"
              />
              <span className="absolute top-3 left-3 backdrop-blur-md bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded select-none">
                EXCLUSIVE
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

        {/* === Content + Sidebar === */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <article className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-10 mb-8">
            <ArticleBody
              content={article.content}
              secondaryImage={article.secondaryImage}
              secondaryImageCaption={article.secondaryImageCaption}
            />
            <div className="mt-10">
              <ArticleHeader article={article} />
            </div>
            <RelatedStories article={article} />
          </article>
          <aside className="pt-2">
            <Sidebar />
          </aside>
        </div>
      </div>
    </>
  );
}
