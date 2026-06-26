import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";
import LatestFeed from "@/components/home/LatestFeed";
import Sidebar from "@/components/layout/Sidebar";
import NewsletterSection from "@/components/ui/NewsletterSection";
import { categories } from "@/data/categories";
import Link from "next/link";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "KeFeL Media — Informing, Inspiring, Connecting Africa and the World",
  description: "Breaking news, analysis and stories from Uganda, Africa and the world. KeFeL Media is Africa's premier digital journalism platform.",
};

export default function HomePage() {
  return (
    <>
      <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-[92px] z-40">
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`}
                className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded hover:bg-brand hover:text-white text-gray-700 dark:text-gray-300 transition-colors whitespace-nowrap">
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <HeroSection />
        <TrendingSection />
        <hr className="border-gray-200 dark:border-zinc-700 mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <LatestFeed />
          </div>
          <div>
            <Sidebar />
          </div>
        </div>
      </div>
      <NewsletterSection />
    </>
  );
}
