import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getSidebarLatest, getWeeklyHighlights } from "@/data/articles";
import { formatRelativeTime } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

export default async function Sidebar() {
  const latestArticles = await getSidebarLatest(5);
  const weeklyHighlights = await getWeeklyHighlights(4);

  return (
    <aside className="space-y-6 md:sticky md:top-24 self-start">
      <div className="bg-zinc-900 rounded border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-base font-black font-sans text-zinc-100 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            Latest News
          </h2>
          <Link href="/latest" className="text-brand text-xs font-bold hover:underline">See All →</Link>
        </div>
        <div className="divide-y divide-zinc-800">
          {latestArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`}
              className="flex gap-3 p-4 hover:bg-zinc-800/50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 group">
              <div className="flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden relative bg-zinc-800 aspect-square">
                <Image src={article.image} alt={article.title} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="160px" />
                <div className="absolute top-1 left-1 z-10 shadow-sm">
                  <CategoryBadge category={article.category} size="xs" />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <h3 className="font-sans text-sm font-bold text-zinc-100 line-clamp-2 group-hover:text-brand transition-colors leading-tight">
                  {article.title}
                </h3>
                <div className="flex items-center gap-1 mt-1.5 text-zinc-500 text-[11px] font-sans">
                  <Clock size={11} />
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 rounded border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-base font-black font-sans text-zinc-100 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Weekly Highlights
          </h2>
          <Link href="/latest" className="text-brand text-xs font-bold hover:underline">More →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          {weeklyHighlights.slice(0, 2).map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`} className="group block hover:-translate-y-1 hover:shadow-sm transition-all duration-300">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-2">
                <Image src={article.image} alt={article.title} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 50vw, 300px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2"><CategoryBadge category={article.category} size="xs" /></div>
              </div>
              <h3 className="font-sans text-xs font-bold text-zinc-100 line-clamp-2 group-hover:text-brand transition-colors leading-tight">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
        <div className="divide-y divide-zinc-800 px-4 pb-4">
          {weeklyHighlights.slice(2, 4).map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`} className="flex items-start gap-2 py-3 group hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-brand font-black text-lg leading-none mt-0.5">•</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-sm font-bold text-zinc-100 line-clamp-2 group-hover:text-brand transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-zinc-500 text-xs font-sans">
                  <Clock size={10} />
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand/20 to-zinc-800 rounded border border-brand/20 p-6 text-center">
        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-2 font-sans">Advertisement</p>
        <div className="bg-white/5 rounded p-6">
          <p className="text-brand font-black text-lg font-headline">Advertise with KeFeL Media</p>
          <p className="text-zinc-400 text-sm mt-1 font-sans">Reach millions of African readers</p>
          <Link href="/advertise" className="inline-block mt-3 bg-brand text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-brand-dark transition-colors font-sans uppercase tracking-wider">
            Get In Touch
          </Link>
        </div>
      </div>
    </aside>
  );
}
