import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Role } from "@/lib/permissions";

const ADMIN_COOKIE = "kfl_admin_session";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
    const role = (match?.[1] ?? "super_admin") as Role;

    let profile = null;
    try {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("role", role)
        .limit(1)
        .single();
      if (data) profile = data;
    } catch {
      // profiles table may not exist
    }

    return NextResponse.json({
      success: true,
      user: profile ?? { role, display_name: "Admin User", username: "admin" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
