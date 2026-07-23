import Link from "next/link";
import { Play, Headphones, ArrowRight } from "lucide-react";
import { getArticlesByCategory } from "@/data/articles";
import { formatRelativeTime } from "@/lib/utils";

export default async function MultimediaSection() {
  const [videos, podcasts] = await Promise.all([
    getArticlesByCategory("videos", 2),
    getArticlesByCategory("podcasts", 2),
  ]);

  const items = [...videos, ...podcasts].slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-rose-500 rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white font-headline">
            Multimedia
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const isVideo = item.category === "videos";
          return (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1">
                    {isVideo ? <Play size={10} /> : <Headphones size={10} />}
                    {isVideo ? "Video" : "Podcast"}
                  </span>
                </div>
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand/80 transition-colors">
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </span>
                  </div>
                )}
              </div>
              <h4 className="text-sm font-bold text-white leading-snug group-hover:text-brand transition-colors line-clamp-2 mb-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-500">
                {formatRelativeTime(item.publishedAt)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
