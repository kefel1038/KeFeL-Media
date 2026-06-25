import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function readingTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function generateFacebookCaption(title: string, excerpt: string): string {
  const clean = stripHtml(excerpt);
  return `${title}\n\n${clean.slice(0, 200)}...\n\n📰 Read more on KeFeL Media`;
}

export function generateTwitterText(title: string, slug: string): string {
  const url = `https://kefelmedia.com/article/${slug}`;
  return `${title}\n\n${url}\n\nvia @KefelMedia`;
}

export function generateInstagramCaption(title: string, excerpt: string): string {
  const clean = stripHtml(excerpt);
  return `${title}\n\n${clean.slice(0, 300)}...\n\n🔗 Link in bio\n\n#KeFeLMedia #News #Africa #Uganda`;
}

export function generateWhatsAppText(title: string, excerpt: string, slug: string): string {
  const clean = stripHtml(excerpt);
  const url = `https://kefelmedia.com/article/${slug}`;
  return `*${title}*\n\n${clean.slice(0, 250)}...\n\nRead more: ${url}`;
}

export function generateMetaDescription(excerpt: string): string {
  return stripHtml(excerpt).slice(0, 160).trim();
}
