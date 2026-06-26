const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled(): boolean {
  return process.env.TURNSTILE_ENABLED === "true";
}

export async function verifyTurnstileToken(
  token: string,
  ip?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isTurnstileEnabled()) {
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Turnstile token is required" };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return { success: false, error: "TURNSTILE_SECRET_KEY not configured" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await res.json();

    if (!data.success) {
      const codes = data["error-codes"]?.join(", ") || "unknown error";
      return { success: false, error: `Turnstile verification failed: ${codes}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: `Turnstile error: ${err.message}` };
  }
}
