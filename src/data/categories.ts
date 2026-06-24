import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "uganda",
    label: "Uganda",
    color: "bg-yellow-500",
    description: "Latest news and developments from Uganda",
  },
  {
    slug: "africa",
    label: "Africa",
    color: "bg-green-600",
    description: "Pan-African stories shaping the continent",
  },
  {
    slug: "world",
    label: "World",
    color: "bg-blue-600",
    description: "Global news affecting Africa and the diaspora",
  },
  {
    slug: "business",
    label: "Business",
    color: "bg-purple-600",
    description: "Economy, markets, and enterprise in Africa",
  },
  {
    slug: "technology",
    label: "Technology",
    color: "bg-cyan-600",
    description: "Innovation and tech shaping Africa's future",
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    color: "bg-pink-500",
    description: "African arts, culture, film, and music",
  },
  {
    slug: "sports",
    label: "Sports",
    color: "bg-orange-500",
    description: "Sports news across Africa and the world",
  },
  {
    slug: "opinion",
    label: "Opinion",
    color: "bg-gray-600",
    description: "Expert voices on Africa's biggest issues",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryColor(slug: string): string {
  const cat = getCategoryBySlug(slug);
  return cat?.color ?? "bg-brand";
}
