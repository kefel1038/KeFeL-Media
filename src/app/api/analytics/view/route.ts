import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "slug is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.rpc("increment_article_views", {
      article_slug: slug,
    });

    if (error) {
      // Fallback: direct update if RPC doesn't exist
      const { error: updateError } = await supabaseAdmin
        .from("articles")
        .update({ views: supabaseAdmin.rpc("increment", { x: 1 }) as any })
        .eq("slug", slug);

      if (updateError) {
        // Last resort: increment via raw query workaround
        const { data, error: fetchError } = await supabaseAdmin
          .from("articles")
          .select("views")
          .eq("slug", slug)
          .single();

        if (fetchError) throw fetchError;

        const currentViews = (data as any)?.views ?? 0;
        const { error: updateError2 } = await supabaseAdmin
          .from("articles")
          .update({ views: currentViews + 1 })
          .eq("slug", slug);

        if (updateError2) throw updateError2;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Silently fail — view tracking should never break the page
    return NextResponse.json({ success: false, error: err.message });
  }
}
