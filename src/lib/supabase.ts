import { createClient, SupabaseClient } from "@supabase/supabase-js";

function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  try {
    return createClient(url, key);
  } catch {
    return createClient("https://placeholder.supabase.co", "placeholder-key");
  }
}

function createSupabaseAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  try {
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return createClient("https://placeholder.supabase.co", "placeholder-key");
  }
}

export const supabase = createSupabaseClient();
export const supabaseAdmin = createSupabaseAdminClient();
