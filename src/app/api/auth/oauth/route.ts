import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const maxDuration = 10;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const provider = searchParams.get("provider");

  if (!provider || !["google", "apple"].includes(provider)) {
    return NextResponse.redirect(
      new URL("/signin?error=invalid_provider", origin)
    );
  }

  const configuredProviders =
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? ["google"]
      : [];

  if (!configuredProviders.includes(provider)) {
    return NextResponse.redirect(
      new URL(
        `/signin?error=provider_not_configured&provider=${provider}`,
        origin
      )
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "apple",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(
      new URL(
        `/signin?error=oauth_failed&provider=${provider}&message=${encodeURIComponent(error?.message || "Unknown error")}`,
        origin
      )
    );
  }

  return NextResponse.redirect(data.url);
}
