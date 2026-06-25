import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, articles: data ?? [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("articles")
      .insert({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        author: body.author,
        image: body.image,
        status: body.status ?? "draft",
        published_at: body.publishedAt ?? new Date().toISOString(),
        reading_time: body.readingTime ?? 5,
        featured: body.featured ?? false,
        trending: body.trending ?? false,
        tags: body.tags ?? [],
        views: 0,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, article: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
