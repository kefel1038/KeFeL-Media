import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createSessionToken, COOKIE_NAME, SESSION_DURATION } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { Role } from "@/lib/permissions";

export async function POST(request: Request) {
  const rl = rateLimit(request, "login");
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: `Too many attempts. Retry in ${rl.retryAfter}s` },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { username, password, turnstileToken } = body;

    const ip = getClientIp(request);
    const tsResult = await verifyTurnstileToken(turnstileToken || "", ip);
    if (!tsResult.success) {
      return NextResponse.json(
        { success: false, message: tsResult.error },
        { status: 403 },
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 },
      );
    }

    const validUser = process.env.ADMIN_USERNAME || "admin";
    const validPass = process.env.ADMIN_PASSWORD;

    if (!validPass) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 },
      );
    }

    if (username === validUser && password === validPass) {
      let role: Role = "super_admin";
      try {
        const { data } = await supabaseAdmin
          .from("profiles")
          .select("role")
          .eq("username", username)
          .single();
        if (data?.role) role = data.role as Role;
      } catch {
        // profiles table may not exist yet, default role
      }

      const token = await createSessionToken(role);

      const response = NextResponse.json({ success: true, role });
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_DURATION,
        path: "/",
      });
      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid username or password." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
