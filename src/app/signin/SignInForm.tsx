"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

function SignInFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    const msg = searchParams.get("message");
    const provider = searchParams.get("provider");

    if (err) {
      const providerLabel =
        provider === "google" ? "Google" : provider === "apple" ? "Apple" : "";
      switch (err) {
        case "provider_not_configured":
          setError(
            `${providerLabel} sign-in is not yet configured. Please use email sign-in or contact support.`
          );
          break;
        case "oauth_failed":
          setError(
            `${providerLabel} sign-in failed${msg ? `: ${msg}` : ""}. Please try again.`
          );
          break;
        case "oauth_denied":
          setError(
            `${providerLabel} sign-in was cancelled or denied${msg ? `: ${msg}` : ""}.`
          );
          break;
        case "auth_failed":
          setError(
            `Authentication failed${msg ? `: ${msg}` : ""}. Please try again.`
          );
          break;
        case "no_code_received":
          setError("No authorization received. Please try again.");
          break;
        default:
          setError(msg || "An authentication error occurred.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push(data.redirectTo || "/");
        router.refresh();
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "apple") => {
    window.location.href = `/api/auth/oauth?provider=${provider}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
          Email address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors placeholder:text-gray-600"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-white pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors placeholder:text-gray-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-400">
          <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-brand focus:ring-brand/50" />
          Remember me
        </label>
        <a href="/forgot-password" className="text-brand hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-950 px-3 text-gray-500">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-xl border border-zinc-700 transition-colors"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("apple")}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-xl border border-zinc-700 transition-colors"
        >
          <AppleIcon />
          Apple
        </button>
      </div>
    </form>
  );
}

export default function SignInForm() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-10 bg-zinc-900 rounded-xl animate-pulse" />
          <div className="h-10 bg-zinc-900 rounded-xl animate-pulse" />
          <div className="h-12 bg-zinc-900 rounded-xl animate-pulse" />
        </div>
      }
    >
      <SignInFormInner />
    </Suspense>
  );
}
