import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Target, Users, BarChart3, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Advertise with KeFeL Media — reach Africa's most engaged audience across our digital news platform.",
};

const benefits = [
  { icon: Users, title: "Engaged Audience", desc: "50K+ monthly readers across Africa and the diaspora, with high engagement metrics." },
  { icon: Target, title: "Precision Targeting", desc: "Reach readers by category, geography, and interest for maximum campaign impact." },
  { icon: TrendingUp, title: "Brand Visibility", desc: "Premium placement options including homepage, category pages, and in-article units." },
  { icon: BarChart3, title: "Measurable Results", desc: "Real-time analytics dashboard showing impressions, clicks, and audience insights." },
];

const adFormats = [
  { title: "Display Ads", desc: "Standard banner and sidebar placements across all pages.", sizes: "300×250, 728×90, 160×600" },
  { title: "Sponsored Content", desc: "Native articles that match our editorial style, marked as sponsored.", sizes: "Full article page takeover" },
  { title: "Newsletter Sponsorship", desc: "Reach subscribers directly in their inbox with sponsored sections.", sizes: "Top banner + text link" },
  { title: "Video Pre-Roll", desc: "Short video ads before our editorial video content.", sizes: "15s / 30s spots" },
];

export default function AdvertisePage() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Advertise with <span className="text-brand">KeFeL Media</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Connect your brand with Africa&rsquo;s most informed and engaged audience.
          Reach decision-makers, professionals, and trendsetters across the continent.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <Icon size={24} className="text-brand mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Ad Formats */}
      <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-8">Available Ad Formats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {adFormats.map((format) => (
          <div key={format.title} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{format.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">{format.desc}</p>
            <p className="text-xs text-gray-400"><strong>Available sizes:</strong> {format.sizes}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-brand/10 to-blue-500/10 rounded-2xl border border-brand/20 p-8 md:p-10 text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Ready to Reach Africa?</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6">
          Let&rsquo;s create a custom advertising package for your brand.
          Our team will work with you to maximize your ROI.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors"
        >
          Get in Touch <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
