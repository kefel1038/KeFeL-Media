import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstileToken, isTurnstileEnabled } from "@/lib/turnstile";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const rl = rateLimit(request, "contact");
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: `Too many requests. Retry in ${rl.retryAfter}s` },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { name, email, subject, message, turnstileToken } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json(
        { success: false, error: "Invalid name" },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message too long" },
        { status: 400 },
      );
    }

    // Verify Turnstile if enabled
    const ip = getClientIp(request);
    const tsResult = await verifyTurnstileToken(turnstileToken || "", ip);
    if (!tsResult.success) {
      return NextResponse.json(
        { success: false, error: tsResult.error },
        { status: 403 },
      );
    }

    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name: name.slice(0, 100),
        email: email.toLowerCase().trim(),
        subject,
        message,
      });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
