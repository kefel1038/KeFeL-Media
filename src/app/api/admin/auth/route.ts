import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const ADMIN_COOKIE = "kfl_admin_session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const validUser = process.env.ADMIN_USERNAME || "admin";
    const validPass = process.env.ADMIN_PASSWORD || "KeFeL@Admin2024!";

    if (username === validUser && password === validPass) {
      // Fetch role from profiles table, default to super_admin
      let role = "super_admin";
      try {
        const { data } = await supabaseAdmin
          .from("profiles")
          .select("role")
          .eq("username", username)
          .single();
        if (data?.role) role = data.role;
      } catch {
        // profiles table may not exist yet, default role
      }

      const response = NextResponse.json({ success: true, role });
      response.cookies.set(ADMIN_COOKIE, role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 8, // 8 hours
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
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
