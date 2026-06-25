import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("newsletter_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, campaigns: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { subject, content } = await request.json();
    if (!subject || !content) {
      return NextResponse.json({ success: false, error: "Subject and content are required" }, { status: 400 });
    }

    // Get active subscriber count
    const { count, error: countError } = await supabaseAdmin
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (countError) throw countError;

    const { data, error } = await supabaseAdmin
      .from("newsletter_campaigns")
      .insert({
        subject,
        content,
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_count: count ?? 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, campaign: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
