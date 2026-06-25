import { supabase, supabaseAdmin } from "./supabase";
import type { Article, Category } from "./types";

const ARTICLES_CACHE = new Map<string, { data: Article[]; time: number }>();
const CACHE_TTL = 30_000;

function fromDb(row: any): Article {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: typeof row.author === "string" ? JSON.parse(row.author) : row.author,
    image: row.image,
    imageCaption: row.image_caption ?? undefined,
    imageCredit: row.image_credit ?? undefined,
    secondaryImage: row.secondary_image ?? undefined,
    secondaryImageCaption: row.secondary_image_caption ?? undefined,
    publishedAt: row.published_at,
    readingTime: row.reading_time,
    featured: row.featured,
    trending: row.trending,
    tags: row.tags ?? [],
    views: row.views ?? 0,
  };
}

async function fetchAllArticles(useCache = true): Promise<Article[]> {
  if (useCache) {
    const cached = ARTICLES_CACHE.get("all");
    if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;
  }
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  const articles = (data ?? []).map(fromDb);
  ARTICLES_CACHE.set("all", { data: articles, time: Date.now() });
  return articles;
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("featured", true)
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ? fromDb(data) : undefined;
}

export async function getTrendingArticles(limit = 3): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
    .or(
      `title.ilike.${q},excerpt.ilike.${q},category.ilike.${q},tags.cs.{${query.toLowerCase()}}`
    )
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function getAllArticles(): Promise<Article[]> {
  return fetchAllArticles();
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
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
