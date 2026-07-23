import { articles } from "@/data/articles";
import { siteConfig } from "@/lib/seo";

export async function GET() {
  const publishedArticles = articles
    .filter((a) => a.status === "published")
    .slice(0, 50);

  const latestDate =
    publishedArticles.length > 0
      ? new Date(publishedArticles[0].publishedAt).toISOString()
      : new Date().toISOString();

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <title>${siteConfig.name}</title>
  <subtitle>${siteConfig.description}</subtitle>
  <link href="${siteConfig.url}/atom.xml" rel="self" />
  <link href="${siteConfig.url}" />
  <id>${siteConfig.url}/</id>
  <updated>${latestDate}</updated>
  <logo>${siteConfig.logo}</logo>
  <icon>${siteConfig.logo}</icon>
  <rights>Copyright ${new Date().getFullYear()} ${siteConfig.name}</rights>
  <author>
    <name>${siteConfig.name}</name>
    <uri>${siteConfig.url}</uri>
  </author>
  ${publishedArticles
    .map(
      (article) => `
  <entry>
    <title><![CDATA[${article.title}]]></title>
    <link href="${siteConfig.url}/article/${article.slug}" rel="alternate" type="text/html" />
    <id>${siteConfig.url}/article/${article.slug}</id>
    <updated>${new Date(article.updatedAt || article.publishedAt).toISOString()}</updated>
    <published>${new Date(article.publishedAt).toISOString()}</published>
    <summary type="html"><![CDATA[${article.excerpt}]]></summary>
    <content type="html"><![CDATA[${article.content || article.excerpt}]]></content>
    <author>
      <name>${article.author.name}</name>
      ${article.author.bio ? `<summary>${article.author.bio}</summary>` : ""}
    </author>
    <category term="${article.category}" label="${article.category}" />
    ${article.tags?.map((t) => `<category term="${t}" />`).join("\n    ") || ""}
    ${article.image ? `<media:thumbnail url="${article.image}" />` : ""}
  </entry>`
    )
    .join("")}
</feed>`;

  return new Response(atom, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
