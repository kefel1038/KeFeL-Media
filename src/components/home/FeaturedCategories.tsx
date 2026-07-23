import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import * as icons from "lucide-react";

const FEATURED = [
  "technology",
  "politics",
  "business",
  "entertainment",
  "sports",
  "ai",
];

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Cpu: icons.Cpu,
  Landmark: icons.Landmark,
  TrendingUp: icons.TrendingUp,
  Film: icons.Film,
  Trophy: icons.Trophy,
  Brain: icons.Brain,
  Globe: icons.Globe,
  Newspaper: icons.Newspaper,
  MapPin: icons.MapPin,
  Globe2: icons.Globe2,
  MessageSquare: icons.MessageSquare,
  Play: icons.Play,
  Headphones: icons.Headphones,
  Lightbulb: icons.Lightbulb,
  Wrench: icons.Wrench,
  Atom: icons.Atom,
  GraduationCap: icons.GraduationCap,
};

function CategoryIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? icons.Newspaper;
  return <Icon size={22} />;
}

export default function FeaturedCategories() {
  const featured = FEATURED.map((slug) => categories.find((c) => c.slug === slug)).filter(Boolean);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-brand rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white font-headline">
            Explore Topics
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {featured.map((cat) => {
          if (!cat) return null;
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center hover:border-zinc-600 transition-all duration-300"
            >
              <div
                className="inline-flex p-3 rounded-xl mb-3 transition-colors group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${cat.accentColor}15` }}
              >
                <div style={{ color: cat.accentColor }}>
                  <CategoryIcon name={cat.icon} />
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{cat.label}</h3>
              <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                {cat.description}
              </p>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-8 transition-all duration-300"
                style={{ backgroundColor: cat.accentColor }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
