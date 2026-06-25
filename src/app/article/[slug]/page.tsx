import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/data/articles";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleBody from "@/components/article/ArticleBody";
import RelatedStories from "@/components/article/RelatedStories";
import Sidebar from "@/components/layout/Sidebar";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative w-full h-[40vh] sm:h-[55vh] lg:h-[65vh] max-h-[700px] bg-gray-900 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-zinc-950 via-transparent to-black/20" />
      </div>

      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <article className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-10 mb-8">
            <ArticleHeader article={article} />
            <ArticleBody content={article.content} />
            <RelatedStories article={article} />
          </article>
          <aside className="pt-8">
            <Sidebar />
          </aside>
        </div>
      </div>
    </>
  );
}
