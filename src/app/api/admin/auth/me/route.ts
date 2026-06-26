import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    let profile = null;
    try {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("role", auth.role)
        .limit(1)
        .single();
      if (data) profile = data;
    } catch {
      // profiles table may not exist
    }

    return NextResponse.json({
      success: true,
      user: profile ?? { role: auth.role, display_name: "Admin User", username: "admin" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
