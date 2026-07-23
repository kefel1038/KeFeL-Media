"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";
import {
  Landmark, TrendingUp, Cpu, Wrench, Atom, GraduationCap, Trophy, Film,
  Globe, MapPin, Globe2, MessageSquare, Play, Headphones, Lightbulb, Brain, Newspaper
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Landmark, TrendingUp, Cpu, Wrench, Atom, GraduationCap, Trophy, Film,
  Globe, MapPin, Globe2, MessageSquare, Play, Headphones, Lightbulb, Brain, Newspaper,
};

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-[var(--card-border)] bg-[var(--background)] transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2.5 category-ticker">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Newspaper;
            const isActive = pathname === `/category/${cat.slug}`;

            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)]/50"
                }`}
                style={isActive ? { backgroundColor: cat.accentColor } : undefined}
                title={cat.description}
              >
                <IconComponent size={14} />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
