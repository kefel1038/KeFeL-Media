import { supabase, supabaseAdmin } from "./supabase";
import type { Article, Category, Author } from "./types";

const ARTICLES_CACHE = new Map<string, { data: Article[]; time: number }>();
const CACHE_TTL = 30_000;

const ARTICLE_COLUMNS = `
  id,
  slug,
  title,
  excerpt,
  content,
  category,
  author,
  image,
  image_caption,
  image_credit,
  secondary_image,
  secondary_image_caption,
  highlights,
  template,
  article_type,
  published_at,
  updated_at,
  reading_time,
  featured,
  trending,
  status,
  tags,
  views
`;

function parseAuthor(raw: any): Author {
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && typeof parsed.name === "string") {
        return { name: parsed.name, avatar: parsed.avatar ?? "", role: parsed.role ?? "" };
      }
    } catch {
      // fallthrough
    }
    return { name: raw, avatar: "", role: "" };
  }
  if (raw && typeof raw === "object") {
    return { name: raw.name ?? "KeFeL Media", avatar: raw.avatar ?? "", role: raw.role ?? "" };
  }
  return { name: "KeFeL Media", avatar: "", role: "" };
}

function fromDb(row: any): Article {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: parseAuthor(row.author),
    image: row.image,
    imageCaption: row.image_caption ?? undefined,
    imageCredit: row.image_credit ?? undefined,
    secondaryImage: row.secondary_image ?? undefined,
    secondaryImageCaption: row.secondary_image_caption ?? undefined,
    highlights: row.highlights ?? [],
    template: row.template ?? "",
    articleType: row.article_type ?? "news",
    publishedAt: row.published_at,
    updatedAt: row.updated_at ?? undefined,
    readingTime: row.reading_time,
    featured: row.featured,
    trending: row.trending,
    status: row.status ?? "draft",
    tags: row.tags ?? [],
    views: row.views ?? 0,
    altText: row.alt_text ?? undefined,
  };
}

async function fetchAllArticles(useCache = true): Promise<Article[]> {
  if (useCache) {
    const cached = ARTICLES_CACHE.get("all");
    if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;
  }
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  const articles = (data ?? []).map(fromDb);
  ARTICLES_CACHE.set("all", { data: articles, time: Date.now() });
  return articles;
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ? fromDb(data) : undefined;
}

export async function getTrendingArticles(limit = 3): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .eq("trending", true)
    .eq("featured", false)
    .order("views", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function getLatestArticles(limit = 8): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function getArticlesByCategory(
  category: string,
  limit?: number
): Promise<Article[]> {
  let query = supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .eq("category", category.toLowerCase())
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ? fromDb(data) : undefined;
}

export async function getSidebarLatest(limit = 4): Promise<Article[]> {
  return getLatestArticles(limit);
}

export async function getWeeklyHighlights(limit = 4): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("views", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function getRelatedArticles(
  article: Article,
  limit = 3
): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = `%${query.toLowerCase()}%`;
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .or(
      `title.ilike.${q},excerpt.ilike.${q},category.ilike.${q}`
    )
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function getArticlesByAuthor(authorName: string, limit = 10): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    const all = (data ?? []).map(fromDb);
    return all
      .filter((a) => a.author.name.toLowerCase() === authorName.toLowerCase())
      .slice(0, limit);
  } catch {
    const all = await fetchAllArticles(false);
    return all
      .filter((a) => a.author.name.toLowerCase() === authorName.toLowerCase())
      .slice(0, limit);
  }
}

export async function getAllArticles(): Promise<Article[]> {
  return fetchAllArticles();
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("slug,label,color,description")
    .order("id");
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    slug: row.slug,
    label: row.label,
    color: row.color,
    description: row.description,
  }));
}

export async function seedArticles(
  articles: Article[]
): Promise<{ success: boolean; count: number }> {
  const rows = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    category: a.category,
    author: a.author,
    image: a.image,
    image_caption: a.imageCaption ?? null,
    image_credit: a.imageCredit ?? null,
    highlights: a.highlights ?? [],
    template: a.template ?? "",
    published_at: a.publishedAt,
    reading_time: a.readingTime,
    featured: a.featured,
    trending: a.trending,
    tags: a.tags,
    views: a.views,
  }));
  const { error, count } = await supabaseAdmin
    .from("articles")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  return { success: true, count: count ?? rows.length };
}

export async function seedCategories(
  categories: Category[]
): Promise<{ success: boolean; count: number }> {
  const rows = categories.map((c) => ({
    slug: c.slug,
    label: c.label,
    color: c.color,
    description: (c as any).description ?? null,
  }));
  const { error, count } = await supabaseAdmin
    .from("categories")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  return { success: true, count: count ?? rows.length };
}
