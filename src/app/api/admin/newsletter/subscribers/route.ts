import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { data, error } = await supabaseAdmin
      .from("subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, subscribers: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { email, name } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from("subscribers")
      .insert({ email, name: name ?? "", source: "admin" })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, subscriber: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
