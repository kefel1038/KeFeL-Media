import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";
import LatestFeed from "@/components/home/LatestFeed";
import JustInStrip from "@/components/home/JustInStrip";
import MostRead from "@/components/home/MostRead";
import TopicExplorer from "@/components/home/TopicExplorer";
import CategorySection from "@/components/home/CategorySection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import EditorsChoice from "@/components/home/EditorsChoice";
import OpinionSection from "@/components/home/OpinionSection";
import MultimediaSection from "@/components/home/MultimediaSection";
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
      {/* Breaking news ticker */}
      <JustInStrip />

      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        {/* ── Hero block ── */}
        <HeroSection />

        <hr className="border-zinc-800 my-10" />

        {/* ── Trending section ── */}
        <TrendingSection />

        <hr className="border-zinc-800 my-10" />

        {/* ── Featured categories ── */}
        <FeaturedCategories />

        <hr className="border-zinc-800 my-10" />

        {/* ── Editor's Pick ── */}
        <EditorsChoice />

        <hr className="border-zinc-800 my-10" />

        {/* ── Main content grid: articles + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-white rounded-full" />
              <h2 className="text-xl md:text-2xl font-black text-white">Latest Stories</h2>
            </div>
            <LatestFeed />
          </div>
          <aside className="space-y-8">
            <MostRead />
            <Sidebar />
          </aside>
        </div>

        <hr className="border-zinc-800 my-10" />

        {/* ── Category sections ── */}
        <div className="space-y-8">
          <CategorySection categorySlug="technology" />
          <CategorySection categorySlug="business" />
        </div>

        <hr className="border-zinc-800 my-10" />

        {/* ── Multimedia ── */}
        <MultimediaSection />

        <hr className="border-zinc-800 my-10" />

        {/* ── Opinion ── */}
        <OpinionSection />

        {/* ── Newsletter CTA ── */}
        <div className="mt-12">
          <NewsletterSection />
        </div>
      </div>

      {/* ── Topic Explorer — full width ── */}
      <TopicExplorer />
    </>
  );
}
