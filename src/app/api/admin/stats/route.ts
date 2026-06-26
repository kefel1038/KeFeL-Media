import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { data: articles, error } = await supabaseAdmin
      .from("articles")
      .select("id,category,views,created_at");
    if (error) throw error;

    const total = articles?.length ?? 0;
    const byCategory: Record<string, number> = {};
    let totalViews = 0;
    for (const a of articles ?? []) {
      byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
      totalViews += a.views ?? 0;
    }

    return NextResponse.json({
      success: true,
      stats: { total, byCategory, totalViews },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
