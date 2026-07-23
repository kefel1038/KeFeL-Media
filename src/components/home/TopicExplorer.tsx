import Link from "next/link";
import {
  Landmark, TrendingUp, Cpu, Wrench, Atom, GraduationCap, Trophy, Film,
  Globe, MapPin, Globe2, MessageSquare, Play, Headphones, Lightbulb, Brain
} from "lucide-react";
import { categories } from "@/data/categories";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Landmark, TrendingUp, Cpu, Wrench, Atom, GraduationCap, Trophy, Film,
  Globe, MapPin, Globe2, MessageSquare, Play, Headphones, Lightbulb, Brain,
};

export default function TopicExplorer() {
  return (
    <section className="py-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] font-headline">
            Explore Topics
          </h2>
          <p className="text-[var(--muted-text)] text-sm mt-2">
            Dive into the stories that matter to you
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.slice(0, 16).map((cat) => {
            const IconComponent = iconMap[cat.icon] || Globe;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-transparent transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.accentColor}15` }}
                >
                  <IconComponent size={22} className="text-zinc-700 dark:text-zinc-300" />
                </div>
                <span className="text-xs font-semibold text-[var(--foreground)] text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
