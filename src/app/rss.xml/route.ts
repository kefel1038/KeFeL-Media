import { articles } from "@/data/articles";
import { siteConfig } from "@/lib/seo";

export async function GET() {
  const publishedArticles = articles
    .filter((a) => a.status === "published")
    .slice(0, 50);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>KeFeL Media RSS</generator>
    <image>
      <url>${siteConfig.logo}</url>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
    </image>
    ${publishedArticles
      .map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteConfig.url}/article/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/article/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <author>${article.author.name}</author>
      <category>${article.category}</category>
      ${article.image ? `<media:thumbnail url="${article.image}" />` : ""}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
