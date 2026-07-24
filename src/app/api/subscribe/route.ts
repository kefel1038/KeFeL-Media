import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const maxDuration = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json(
          {
            success: true,
            message: "You are already subscribed! Check your inbox for updates.",
          },
          { status: 200 }
        );
      }

      const { error: reactivateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "active",
          name: name || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (reactivateError) {
        return NextResponse.json(
          { success: false, error: "Failed to reactivate subscription" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Welcome back! Your subscription has been reactivated.",
      });
    }

    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        name: name || null,
        status: "active",
        subscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      return NextResponse.json(
        { success: false, error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Welcome to KeFeL Media.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
