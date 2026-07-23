export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles, getArticlesByAuthor } from "@/data/articles";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleHighlights from "@/components/article/ArticleHighlights";
import SocialMediaCopy from "@/components/article/SocialMediaCopy";
import RelatedStories from "@/components/article/RelatedStories";
import Sidebar from "@/components/layout/Sidebar";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import CategoryBadge from "@/components/ui/CategoryBadge";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ShareToolbar from "@/components/ui/ShareToolbar";
import { formatDate, readingTimeLabel, generateMetaDescription, stripHtml } from "@/lib/utils";
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { Calendar, Clock, Eye, User } from "lucide-react";
import { ReadingProgressBar } from "./ReadingProgress";
import { ShareButton } from "./ShareButton";
import { ArticleToolbar } from "./ArticleToolbar";
import ArticleSummary from "@/components/article/ArticleSummary";
import ArticleQnA from "@/components/article/ArticleQnA";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch (error) {
    console.error("generateMetadata error:", error);
  }
  if (!article) return { title: "Article Not Found" };

  const description = generateMetaDescription(article.excerpt || article.content || "");
  const keywords = (article.tags ?? []).join(", ");

  return {
    title: article.title || "",
    description,
    keywords,
    openGraph: {
      title: article.title || "",
      description,
      url: `https://kefelmedia.com/article/${article.slug}`,
      siteName: "KeFeL Media",
      images: [{
        url: article.image || "",
        width: 1200,
        height: 630,
        alt: article.altText || article.title || "",
      }],
      type: "article",
      publishedTime: article.publishedAt || "",
      modifiedTime: article.updatedAt || undefined,
      authors: article.author?.name ? [article.author.name] : ["KeFeL Media"],
      tags: article.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title || "",
      description,
      images: [article.image || ""],
    },
    alternates: {
      canonical: `https://kefelmedia.com/article/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article: NonNullable<Awaited<ReturnType<typeof getArticleBySlug>>> | undefined;
  try {
    article = await getArticleBySlug(slug);
  } catch (error) {
    console.error("ARTICLE PAGE ERROR — getArticleBySlug:", error);
    throw error;
  }
  if (!article) notFound();

  const authorName = article.author?.name || "KeFeL Media";
  const related = await getRelatedArticles(article, 3).catch(() => []);
  const authorArticles = await getArticlesByAuthor(authorName, 4).catch(() => []);

  const wordCount = stripHtml(article.content || "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const jsonLd = generateArticleJsonLd({
    ...article,
    wordCount,
    author: {
      name: article.author?.name || "KeFeL Media",
      avatar: article.author?.avatar,
      role: article.author?.role,
      bio: article.author?.bio,
    },
  });

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: article.category || "News", href: `/category/${article.category || ""}` },
    { label: article.title || "Untitled Story", href: `/article/${article.slug}` },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs.map(b => ({ name: b.label, url: `https://kefelmedia.com${b.href === "/" ? "" : b.href}` })));

  return (
    <>
      <PageViewTracker slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Reading progress indicator */}
      <ReadingProgressBar />

      {/* Reading toolbar with font size + TOC */}
      <ArticleToolbar />

      {/* Mobile sticky share bar */}
      <div className="mobile-share-bar md:hidden shadow-lg">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {article.publishedAt ? formatDate(article.publishedAt) : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {readingTimeLabel(readingTime)}
          </span>
          {(article.views ?? 0) > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye size={13} />
              {(article.views ?? 0).toLocaleString()}
            </span>
          )}
        </div>
        <ShareButton article={article} />
      </div>

      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <BreadcrumbNav items={breadcrumbs} className="mb-6 md:mb-8" />

        {/* Main grid: 12-col — article 8col + sidebar 4col */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Article column — 8 of 12 */}
          <article className="lg:col-span-8">
            {/* Category + headline row */}
            <header className="mb-6 md:mb-8">
              <div className="mb-3 md:mb-4">
                <CategoryBadge category={article.category || ""} size="lg" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.1] mb-4 md:mb-5 font-headline">
                {article.title || "Untitled Story"}
              </h1>
              <p className="article-lead !border-l-0 !pl-0 !text-lg md:!text-xl !text-zinc-400 !font-normal !mb-0">
                {article.excerpt || ""}
              </p>
            </header>

            {/* Author bar + metadata + actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 md:mb-8 border-y border-zinc-800">
              <Link
                href={article.author?.name ? `/author/${encodeURIComponent(article.author.name.toLowerCase().replace(/\s+/g, "-"))}` : "#"}
                className="flex items-center gap-3 group"
              >
                {article.author?.avatar ? (
                  <img
                    src={article.author.avatar}
                    alt={article.author.name || "Author"}
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-brand/30 group-hover:ring-brand transition-all"
                  />
                ) : (
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-full ring-2 ring-brand/30 group-hover:ring-brand transition-all bg-brand flex items-center justify-center text-white font-bold text-sm md:text-base">
                    {(article.author?.name || "K").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-zinc-100 text-sm md:text-base group-hover:text-brand transition-colors">
                    {article.author?.name || "KeFeL Media"}
                  </p>
                  <p className="text-zinc-400 text-xs">{article.author?.role || ""}</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 text-xs md:text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <time dateTime={article.publishedAt || ""}>{article.publishedAt ? formatDate(article.publishedAt) : ""}</time>
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <Clock size={14} />
                  {readingTimeLabel(readingTime)}
                </span>
                {(article.views ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} />
                    {(article.views ?? 0).toLocaleString()}
                  </span>
                )}
                <BookmarkButton articleId={article.id} />
              </div>
            </div>

            {/* Featured image */}
            {article.image && (
              <div className="relative w-full aspect-video min-h-[250px] sm:min-h-[350px] md:max-h-[450px] overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/50 mb-8">
                <img
                  src={
                    typeof article.image === "string" && article.image.startsWith("http")
                      ? article.image
                      : `${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}/storage/v1/object/public/media/${article.image || ""}`
                  }
                  alt={article.title || "Article Image"}
                  className="absolute inset-0 w-full h-full object-cover object-center block"
                  loading="eager"
                />
                {(article.imageCaption || article.imageCredit) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {article.imageCaption && (
                      <p className="text-white/90 text-xs">{article.imageCaption}</p>
                    )}
                    {article.imageCredit && (
                      <p className="text-white/60 text-[10px] mt-1">{article.imageCredit}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Article body */}
            <div className="mx-auto" style={{ maxWidth: "720px" }}>
              {article.highlights && article.highlights.length > 0 && (
                <ArticleHighlights items={article.highlights} />
              )}
              <ArticleBody
                content={article.content}
                secondaryImage={article.secondaryImage}
                secondaryImageCaption={article.secondaryImageCaption}
              />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mx-auto mt-8" style={{ maxWidth: "720px" }}>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="text-xs px-3 py-1.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--muted-text)] hover:text-brand-primary hover:border-brand-primary/50 transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* AI Summary */}
            <div className="mx-auto mt-6" style={{ maxWidth: "720px" }}>
              <ArticleSummary articleId={article.id} content={article.content} />
            </div>

            {/* Share toolbar */}
            <div className="mx-auto mt-8" style={{ maxWidth: "720px" }}>
              <div className="py-4 border-t border-b border-[var(--card-border)]">
                <p className="text-xs font-semibold text-[var(--muted-text)] uppercase tracking-wider mb-3">Share this story</p>
                <ShareToolbar title={article.title} slug={article.slug} excerpt={article.excerpt} />
              </div>
            </div>

            {/* Author profile card */}
            <div className="mx-auto" style={{ maxWidth: "720px" }}>
              <div className="mt-10 md:mt-12 p-5 md:p-6 bg-zinc-800/40 rounded-xl border border-zinc-800">
                <div className="flex items-start gap-4">
                  {article.author?.avatar ? (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name || "Author"}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-brand/30"
                    />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full ring-2 ring-brand/30 bg-brand flex items-center justify-center text-white font-bold text-lg md:text-xl">
                      {(article.author?.name || "K").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={article.author?.name ? `/author/${encodeURIComponent(article.author.name.toLowerCase().replace(/\s+/g, "-"))}` : "#"}
                      className="font-bold text-zinc-100 hover:text-brand transition-colors"
                    >
                      {article.author?.name || "KeFeL Media"}
                    </Link>
                    <p className="text-xs md:text-sm text-zinc-400 mt-0.5">{article.author?.role || ""}</p>
                    {article.author?.bio && (
                      <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{article.author.bio}</p>
                    )}
                    {authorArticles.length > 1 && (
                      <Link
                        href={article.author?.name ? `/author/${encodeURIComponent(article.author.name.toLowerCase().replace(/\s+/g, "-"))}` : "#"}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline mt-2"
                      >
                        <User size={12} />
                        More from {article.author?.name || "KeFeL Media"}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Social share */}
              <SocialMediaCopy article={article} />

              {/* Updated date */}
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <p className="text-xs text-zinc-500 mt-6 text-center">
                  Updated: {formatDate(article.updatedAt)}
                </p>
              )}
            </div>

            {/* Related stories */}
            <RelatedStories article={article} related={related} />
          </article>

          {/* Sidebar — 4 of 12 */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>
        </div>

        {/* Bottom spacer for mobile share bar */}
        <div className="h-16 md:h-0" />
      </div>

      {/* AI Q&A chat widget */}
      <ArticleQnA
        articleId={article.id}
        articleTitle={article.title || ""}
        content={stripHtml(article.content)}
      />
    </>
  );
}
