import { ArrowRight, Mail, Zap } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="bg-gradient-to-br from-[#111111] to-zinc-800 py-16 mt-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand/20 rounded-2xl mb-5">
            <Zap size={28} className="text-brand" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Never Miss a Story
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Join 50,000+ readers getting KeFeL Media&apos;s daily briefing — Africa&apos;s
            most important stories, curated and delivered every morning.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-gray-500 pl-9 pr-4 py-3.5 focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-brand hover:bg-orange-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Subscribe Free <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-gray-600 text-xs mt-4">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
