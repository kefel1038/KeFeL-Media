import { NextResponse } from "next/server";
import type { Role } from "./permissions";

const COOKIE_NAME = "kfl_admin_session";
const SESSION_DURATION = 8 * 60 * 60; // 8 hours in seconds

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "kfl-media-secret-2024-xK9mP3qR";
}

function encodeBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf-8");
  }
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(str);
}

export async function createSessionToken(role: Role): Promise<string> {
  const payload = JSON.stringify({ role, exp: Math.floor(Date.now() / 1000) + SESSION_DURATION });
  const encoded = encodeBase64(payload);
  const signature = await createSignature(encoded);
  return `${encoded}.${signature}`;
}

async function createSignature(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return encodeBase64(String.fromCharCode(...new Uint8Array(sig)));
}

async function verify(token: string): Promise<{ role: Role; exp: number } | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, sig] = parts;
  const expectedSig = await createSignature(encoded);
  if (sig !== expectedSig) return null;

  try {
    const parsed = JSON.parse(decodeBase64(encoded));
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return { role: parsed.role as Role, exp: parsed.exp };
  } catch {
    return null;
  }
}

export async function requireAuth(
  request: Request,
  minimumRole?: Role,
): Promise<{ role: Role } | NextResponse> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  }

  const session = await verify(match[1]);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired session" },
      { status: 401 },
    );
  }

  if (minimumRole) {
    const { canAccess } = await import("./permissions");
    if (!canAccess(session.role, minimumRole)) {
      return NextResponse.json(
      { success: false, message: "Insufficient permissions" },
      { status: 403 },
    );
    }
  }

  return { role: session.role };
}

export async function verifySession(request: Request): Promise<Role | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const session = await verify(match[1]);
  return session?.role ?? null;
}

export { COOKIE_NAME, SESSION_DURATION };
