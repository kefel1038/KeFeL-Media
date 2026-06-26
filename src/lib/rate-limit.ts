const store = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  login: { windowMs: 60_000, maxRequests: 5 },
  contact: { windowMs: 60_000, maxRequests: 3 },
  newsletter: { windowMs: 60_000, maxRequests: 5 },
  general: { windowMs: 60_000, maxRequests: 30 },
};

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

export function rateLimit(
  request: Request,
  route: keyof typeof DEFAULTS = "general",
): { allowed: boolean; retryAfter?: number } {
  const config = DEFAULTS[route] || DEFAULTS.general;
  const ip = getClientIp(request);
  const key = `${route}:${ip}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 300_000);
}
