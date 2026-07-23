export interface Category {
  slug: string;
  label: string;
  color: string;
  description: string;
  icon: string;
  accentColor: string;
}

export const categories: Category[] = [
  {
    slug: "politics",
    label: "Politics",
    color: "bg-[var(--color-accent-politics)]",
    accentColor: "#DC2626",
    icon: "Landmark",
    description: "Political news, elections, and governance across Africa and the world",
  },
  {
    slug: "business",
    label: "Business",
    color: "bg-[var(--color-accent-business)]",
    accentColor: "#7C3AED",
    icon: "TrendingUp",
    description: "Economy, markets, and enterprise in Africa",
  },
  {
    slug: "technology",
    label: "Technology",
    color: "bg-[var(--color-accent-tech)]",
    accentColor: "#0891B2",
    icon: "Cpu",
    description: "Innovation and tech shaping Africa's future",
  },
  {
    slug: "engineering",
    label: "Engineering",
    color: "bg-[var(--color-accent-engineering)]",
    accentColor: "#D97706",
    icon: "Wrench",
    description: "Infrastructure, construction, and engineering breakthroughs",
  },
  {
    slug: "science",
    label: "Science",
    color: "bg-[var(--color-accent-science)]",
    accentColor: "#059669",
    icon: "Atom",
    description: "Health, environment, and scientific breakthroughs",
  },
  {
    slug: "education",
    label: "Education",
    color: "bg-[var(--color-accent-education)]",
    accentColor: "#2563EB",
    icon: "GraduationCap",
    description: "Education policy, innovation, and learning across Africa",
  },
  {
    slug: "sports",
    label: "Sports",
    color: "bg-[var(--color-accent-sports)]",
    accentColor: "#EA580C",
    icon: "Trophy",
    description: "Sports news across Africa and the world",
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    color: "bg-[var(--color-accent-entertainment)]",
    accentColor: "#EC4899",
    icon: "Film",
    description: "African arts, culture, film, and music",
  },
  {
    slug: "africa",
    label: "Africa",
    color: "bg-[var(--color-accent-africa)]",
    accentColor: "#16A34A",
    icon: "Globe",
    description: "Pan-African stories shaping the continent",
  },
  {
    slug: "uganda",
    label: "Uganda",
    color: "bg-[var(--color-accent-uganda)]",
    accentColor: "#CA8A04",
    icon: "MapPin",
    description: "Latest news and developments from Uganda",
  },
  {
    slug: "world",
    label: "World",
    color: "bg-[var(--color-accent-world)]",
    accentColor: "#4F46E5",
    icon: "Globe2",
    description: "Global news affecting Africa and the diaspora",
  },
  {
    slug: "opinion",
    label: "Opinion",
    color: "bg-[var(--color-accent-opinion)]",
    accentColor: "#6B7280",
    icon: "MessageSquare",
    description: "Expert voices on Africa's biggest issues",
  },
  {
    slug: "videos",
    label: "Videos",
    color: "bg-[var(--color-accent-videos)]",
    accentColor: "#E11D48",
    icon: "Play",
    description: "Original documentary and news videos",
  },
  {
    slug: "podcasts",
    label: "Podcasts",
    color: "bg-[var(--color-accent-podcasts)]",
    accentColor: "#8B5CF6",
    icon: "Headphones",
    description: "In-depth audio reporting and interviews",
  },
  {
    slug: "innovation",
    label: "Innovation",
    color: "bg-[var(--color-accent-innovation)]",
    accentColor: "#F59E0B",
    icon: "Lightbulb",
    description: "Breakthrough ideas and emerging trends",
  },
  {
    slug: "ai",
    label: "AI",
    color: "bg-[var(--color-accent-ai)]",
    accentColor: "#6366F1",
    icon: "Brain",
    description: "Artificial intelligence and its impact on Africa and the world",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryColor(slug: string): string {
  const cat = getCategoryBySlug(slug);
  return cat?.color ?? "bg-brand-primary";
}

export function getCategoryAccentColor(slug: string): string {
  const cat = getCategoryBySlug(slug);
  return cat?.accentColor ?? "#D32F2F";
}

export function getCategoryIcon(slug: string): string {
  const cat = getCategoryBySlug(slug);
  return cat?.icon ?? "Newspaper";
}

export function getCategoryByLabel(label: string): Category | undefined {
  return categories.find(
    (c) => c.label.toLowerCase() === label.toLowerCase()
  );
}
