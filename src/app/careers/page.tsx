import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the KeFeL Media team — careers in journalism, technology, marketing, and media across Africa.",
};

const openRoles = [
  {
    title: "Senior Reporter — Politics & Policy",
    type: "Full-time",
    location: "Kampala, Uganda",
    dept: "Editorial",
  },
  {
    title: "Digital Editor",
    type: "Full-time",
    location: "Kampala, Uganda",
    dept: "Editorial",
  },
  {
    title: "Video Journalist",
    type: "Full-time",
    location: "Nairobi, Kenya",
    dept: "Video",
  },
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote (Africa)",
    dept: "Technology",
  },
  {
    title: "Social Media Manager",
    type: "Full-time",
    location: "Kampala, Uganda",
    dept: "Marketing",
  },
  {
    title: "Advertising Sales Executive",
    type: "Full-time",
    location: "Kampala, Uganda",
    dept: "Sales",
  },
];

const perks = [
  { icon: Star, label: "Competitive salary & benefits" },
  { icon: Clock, label: "Flexible working hours" },
  { icon: MapPin, label: "Remote-friendly team" },
  { icon: Briefcase, label: "Professional development budget" },
];

export default function CareersPage() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Join the <span className="text-brand">Team</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Help us shape the future of African journalism. KeFeL Media is looking
          for passionate, talented people who believe in the power of great storytelling.
        </p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {perks.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.label} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 text-center">
              <Icon size={20} className="text-brand mx-auto mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{p.label}</p>
            </div>
          );
        })}
      </div>

      {/* Open Roles */}
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Open Positions</h2>
      <div className="space-y-4 mb-14">
        {openRoles.map((role) => (
          <div
            key={role.title}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand/40 transition-colors"
          >
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{role.title}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Briefcase size={12} /> {role.type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {role.location}
                </span>
                <span className="text-brand font-medium">{role.dept}</span>
              </div>
            </div>
            <a
              href={`mailto:careers@kefelmedia.com?subject=Application: ${encodeURIComponent(role.title)}`}
              className="flex items-center gap-1 text-brand hover:text-brand-dark font-semibold text-sm whitespace-nowrap transition-colors"
            >
              Apply Now <ArrowRight size={14} />
            </a>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Don&rsquo;t See Your Role?</h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto mb-5">
          We&rsquo;re always looking for talented journalists, engineers, designers, and media professionals.
          Send us your CV and we&rsquo;ll keep you in mind.
        </p>
        <a
          href="mailto:careers@kefelmedia.com"
          className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors"
        >
          Send Your CV <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
