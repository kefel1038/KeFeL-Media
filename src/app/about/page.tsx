import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Users, Globe, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "KeFeL Media is Africa's premier digital news platform. Learn about our mission, values, and the team behind the stories.",
};

const stats = [
  { icon: Newspaper, label: "Stories Published", value: "1,000+" },
  { icon: Users, label: "Monthly Readers", value: "50K+" },
  { icon: Globe, label: "Countries Covered", value: "30+" },
  { icon: Award, label: "Journalism Awards", value: "12" },
];

const values = [
  { title: "Truth First", desc: "We verify before we publish. Every story meets rigorous editorial standards." },
  { title: "African Perspective", desc: "We tell Africa's story from within, highlighting voices often overlooked." },
  { title: "Independence", desc: "We answer to readers, not advertisers or political interests." },
  { title: "Innovation", desc: "We embrace digital tools to deliver news that matters, when it matters." },
];

export default function AboutPage() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          About <span className="text-brand">KeFeL Media</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Informing, inspiring, and connecting Africa and the world through
          fearless, independent journalism.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="text-center bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <Icon size={24} className="text-brand mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Our Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              KeFeL Media was founded with a singular mission: to deliver
              high-quality, independent journalism that serves the African
              continent and the global community. In an era of misinformation
              and media consolidation, we stand for facts, context, and depth.
            </p>
            <p>
              From breaking news in Kampala to investigative reports spanning
              the continent, our team of experienced journalists works around
              the clock to bring you stories that matter. We cover politics,
              business, technology, sports, entertainment, and culture — always
              through an African lens.
            </p>
            <p>
              Our name, KeFeL, represents our commitment to Knowledge, Facts,
              and Leadership in journalism. We believe an informed society is
              an empowered one.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-brand/10 to-blue-500/10 rounded-2xl p-8 border border-brand/20">
          <h3 className="font-bold text-lg text-white mb-3">Our Mission</h3>
          <p className="text-gray-400 italic leading-relaxed mb-6">
            &ldquo;To inform, inspire, and connect — delivering truth without
            fear or favor, and amplifying the stories that shape our world.&rdquo;
          </p>
          <h3 className="font-bold text-lg text-white mb-3">Our Vision</h3>
          <p className="text-gray-400 italic leading-relaxed">
            &ldquo;A well-informed Africa where quality journalism is
            accessible to all, driving accountability, understanding, and
            progress across the continent.&rdquo;
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-white text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h3 className="font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-black text-white mb-4">Our Team</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-8">
          KeFeL Media is powered by a diverse team of journalists, editors,
          photographers, and digital media professionals across Africa and
          beyond.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors"
        >
          Join Our Team <ArrowRight size={16} />
        </Link>
      </div>

      {/* Editorial Standards */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
        <h2 className="text-xl font-black text-white mb-4">Editorial Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white mb-1">Accuracy</h3>
              <p>Every story is fact-checked and sourced. We correct errors promptly and transparently.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Independence</h3>
              <p>Our reporting is free from political, commercial, or ideological influence.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white mb-1">Fairness</h3>
              <p>We seek diverse perspectives and represent all sides of every story with respect.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Accountability</h3>
              <p>We hold power to account and welcome feedback from our readers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
