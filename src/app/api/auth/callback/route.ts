import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const maxDuration = 10;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    const message = errorDescription || error;
    return NextResponse.redirect(
      new URL(
        `/signin?error=oauth_denied&message=${encodeURIComponent(message)}`,
        origin
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/signin?error=no_code_received", origin)
    );
  }

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(
      new URL(
        `/signin?error=auth_failed&message=${encodeURIComponent(exchangeError.message)}`,
        origin
      )
    );
  }

  return NextResponse.redirect(new URL("/", origin));
}
