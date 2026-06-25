import { supabaseAdmin } from "@/lib/supabase";
import { TrendingUp, Eye, ArrowUp } from "lucide-react";
import type { Author } from "@/lib/types";

export default async function TrendingPage() {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("id,title,category,views,created_at,slug,author")
    .order("views", { ascending: false })
    .limit(20);

  const top = articles ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Trending Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">Articles ranked by popularity and momentum</p>
        </div>
        <span className="text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <TrendingUp size={14} />
          Updated live
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {top.slice(0, 3).map((a, i) => (
          <div key={a.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/10 rounded-bl-2xl flex items-center justify-center">
              <span className="text-2xl font-black text-brand">#{i + 1}</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 pr-12 line-clamp-2">{a.title}</h3>
            <p className="text-xs text-gray-400 capitalize mb-3">{a.category}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Eye size={12} />{(a.views ?? 0).toLocaleString()} views</span>
              <span className="flex items-center gap-1">
                <ArrowUp size={12} className="text-green-500" />
                Trending
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800">
              {["#", "Article", "Category", "Views", "Trend", "Published"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((a, i) => {
              const authorName = typeof a.author === "object" && a.author !== null
                ? (a.author as Author).name
                : String(a.author ?? "");
              return (
                <tr key={a.id} className="border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className={`text-sm font-black ${i < 3 ? "text-brand" : "text-gray-300 dark:text-zinc-700"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{a.title}</p>
                    <p className="text-xs text-gray-400">{authorName}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 capitalize">{a.category}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{(a.views ?? 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp size={12} />
                      Up
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
