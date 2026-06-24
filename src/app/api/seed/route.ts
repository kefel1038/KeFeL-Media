import { NextResponse } from "next/server";
import { articles } from "@/data/articles";
import { categories } from "@/data/categories";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
  try {
    await supabaseAdmin.from("articles").delete().neq("id", 0);
    await supabaseAdmin.from("categories").delete().neq("id", 0);

    const articleRows = articles.map((a) => ({
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

    const categoryRows = categories.map((c) => ({
      slug: c.slug,
      label: c.label,
      color: c.color,
      description: (c as any).description ?? null,
    }));

    const { error: catErr } = await supabaseAdmin
      .from("categories")
      .insert(categoryRows);
    if (catErr) throw catErr;

    const { error: artErr } = await supabaseAdmin
      .from("articles")
      .insert(articleRows);
    if (artErr) throw artErr;

    return NextResponse.json({
      success: true,
      articles: articleRows.length,
      categories: categoryRows.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Seed failed" },
      { status: 500 }
    );
  }
}
