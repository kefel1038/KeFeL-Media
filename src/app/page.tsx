import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";
import LatestFeed from "@/components/home/LatestFeed";
import Sidebar from "@/components/layout/Sidebar";
import NewsletterSection from "@/components/ui/NewsletterSection";
import { categories } from "@/data/categories";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KeFeL Media — Informing, Inspiring, Connecting Africa and the World",
  description:
    "Breaking news, analysis and stories from Uganda, Africa and the world. KeFeL Media is Africa's premier digital journalism platform.",
};

export default function HomePage() {
  return (
    <div>
      {/* Category Nav Strip */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-[97px] z-40">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand hover:text-white text-gray-700 dark:text-gray-300 transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Hero */}
        <HeroSection />

        {/* Trending */}
        <TrendingSection />

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-zinc-700 mb-10" />

        {/* Latest + Sidebar 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LatestFeed />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-[145px]">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
