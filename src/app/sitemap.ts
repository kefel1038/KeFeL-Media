import { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { categories } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kefelmedia.com";
  const now = new Date();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/advertise`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${baseUrl}/rss.xml`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.1 },
    { url: `${baseUrl}/atom.xml`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.1 },
  ];

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const articleRoutes = articles
    .filter((a) => a.status === "published")
    .map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const authorSlugs = new Set(
    articles
      .filter((a) => a.status === "published")
      .map((a) => a.author?.name?.toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  );

  const authorRoutes = Array.from(authorSlugs).map((slug) => ({
    url: `${baseUrl}/author/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryRoutes, ...articleRoutes, ...authorRoutes];
}
