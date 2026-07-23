import { Crown, Check, ArrowRight } from "lucide-react";

interface PaywallCTAProps {
  variant?: "inline" | "modal" | "banner";
}

export default function PaywallCTA({ variant = "inline" }: PaywallCTAProps) {
  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-brand/10 via-zinc-900 to-brand/10 border border-brand/20 rounded-xl p-6 my-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand/20 rounded-lg">
              <Crown size={20} className="text-brand" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Unlock unlimited reading</h3>
              <p className="text-sm text-gray-400">Get full access to all articles, ad-free reading, and AI-powered features.</p>
            </div>
          </div>
          <a
            href="/subscribe"
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            Subscribe Now <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="p-3 bg-brand/10 rounded-xl inline-flex mb-4">
              <Crown size={28} className="text-brand" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Premium Content</h2>
            <p className="text-gray-400 text-sm">
              This article is available exclusively to KeFeL Media subscribers.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {["Unlimited articles", "AI-powered summaries", "Ad-free experience", "Offline reading"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <Check size={16} className="text-brand flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="/subscribe"
              className="block text-center bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/signin"
              className="block text-center text-gray-400 hover:text-white text-sm transition-colors"
            >
              Already a subscriber? Sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 my-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-transparent to-brand/5" />
      <div className="relative flex items-center gap-4">
        <div className="p-2.5 bg-brand/10 rounded-lg flex-shrink-0">
          <Crown size={20} className="text-brand" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-0.5">Continue reading</h4>
          <p className="text-xs text-gray-500">Subscribe to access this article and more</p>
        </div>
        <a
          href="/subscribe"
          className="flex items-center gap-1 bg-brand hover:bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Subscribe <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
}
