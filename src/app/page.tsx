import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";
import LatestFeed from "@/components/home/LatestFeed";
import JustInStrip from "@/components/home/JustInStrip";
import MostRead from "@/components/home/MostRead";
import TopicExplorer from "@/components/home/TopicExplorer";
import CategorySection from "@/components/home/CategorySection";
import Sidebar from "@/components/layout/Sidebar";
import NewsletterSection from "@/components/ui/NewsletterSection";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "KeFeL Media — Informing, Inspiring, Connecting Africa and the World",
  description: "Breaking news, analysis and stories from Uganda, Africa and the world. KeFeL Media is Africa's premier digital journalism platform.",
};

export default function HomePage() {
  return (
    <>
      {/* Just In strip */}
      <JustInStrip />

      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        {/* Hero + Trending Section (BBC style lead) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8">
            <HeroSection />
          </div>
          <div className="lg:col-span-4 flex flex-col">
            <div className="border-l-4 border-brand-primary pl-4 mb-4">
              <h2 className="text-xl font-bold font-headline">Trending</h2>
            </div>
            <TrendingSection />
          </div>
        </div>

        <hr className="border-[var(--card-border)] mb-12" />

        {/* Main Grid: Articles + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <div className="border-b-2 border-[var(--card-border)] mb-6 pb-2">
              <h2 className="text-2xl font-bold font-headline text-brand-primary">
                Latest Stories
              </h2>
            </div>
            <LatestFeed />
          </div>
          <aside className="space-y-8">
            <MostRead />
            <Sidebar />
          </aside>
        </div>

        {/* Category Sections */}
        <div className="mt-12 space-y-8">
          <CategorySection categorySlug="technology" />
          <CategorySection categorySlug="business" />
        </div>

        {/* Newsletter CTA mid-page */}
        <div className="mt-12">
          <NewsletterSection />
        </div>
      </div>

      {/* Topic Explorer - full width */}
      <TopicExplorer />
    </>
  );
}
