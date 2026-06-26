import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request, "super_admin");
  if (auth instanceof NextResponse) return auth;

  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, users: data ?? [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, "super_admin");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        username: body.username,
        email: body.email,
        display_name: body.display_name,
        role: body.role ?? "journalist",
        status: "active",
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
