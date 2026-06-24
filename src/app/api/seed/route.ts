import { NextResponse } from "next/server";
import { articles } from "@/data/articles";
import { categories } from "@/data/categories";
import { seedArticles, seedCategories } from "@/lib/supabase-queries";

export async function POST() {
  try {
    const articlesResult = await seedArticles(articles);
    const categoriesResult = await seedCategories(
      categories.map((c) => ({ ...c, description: (c as any).description ?? "" }))
    );
    return NextResponse.json({
      success: true,
      articles: articlesResult.count,
      categories: categoriesResult.count,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Seed failed" },
      { status: 500 }
    );
  }
}
