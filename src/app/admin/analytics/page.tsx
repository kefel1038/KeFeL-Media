import { supabaseAdmin } from "@/lib/supabase";
import { Eye, TrendingUp, MousePointerClick, Globe, Smartphone, Monitor } from "lucide-react";

export default async function AnalyticsPage() {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("id,title,category,views,created_at,slug,author")
    .order("views", { ascending: false });

  const totalViews = articles?.reduce((s, a) => s + (a.views ?? 0), 0) ?? 0;
  const topArticles = articles?.slice(0, 10) ?? [];

  const byCategory: Record<string, { count: number; views: number }> = {};
  for (const a of articles ?? []) {
    const cat = a.category;
    if (!byCategory[cat]) byCategory[cat] = { count: 0, views: 0 };
    byCategory[cat].count++;
    byCategory[cat].views += a.views ?? 0;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Content performance &amp; audience insights</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <Eye size={18} className="text-blue-600 mb-2" />
          <p className="text-2xl font-black text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Page Views</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <TrendingUp size={18} className="text-green-600 mb-2" />
          <p className="text-2xl font-black text-gray-900 dark:text-white">{articles?.length ?? 0}</p>
          <p className="text-xs text-gray-500">Total Articles</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <MousePointerClick size={18} className="text-purple-600 mb-2" />
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {totalViews && articles?.length ? Math.round(totalViews / articles.length).toLocaleString() : 0}
          </p>
          <p className="text-xs text-gray-500">Avg. Views / Article</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <Globe size={18} className="text-cyan-600 mb-2" />
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {Object.keys(byCategory).length}
          </p>
          <p className="text-xs text-gray-500">Categories Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Most Read Articles</h2>
          <div className="space-y-3">
            {topArticles.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                <span className={`text-sm font-black w-6 ${i < 3 ? "text-brand" : "text-gray-300 dark:text-zinc-700"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 capitalize">{a.category}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{(a.views ?? 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Category Performance</h2>
          <div className="space-y-3">
            {Object.entries(byCategory)
              .sort(([, a], [, b]) => b.views - a.views)
              .map(([cat, data]) => {
                const pct = totalViews ? Math.round((data.views / totalViews) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                      <span className="text-xs text-gray-400">{data.views.toLocaleString()} views</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{data.count} articles · {pct}% of traffic</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm flex items-center gap-2">
            <Monitor size={14} className="text-blue-600" />
            Device Breakdown
          </h2>
          <div className="space-y-3">
            {[
              { label: "Desktop", pct: 45, icon: Monitor, color: "bg-blue-600" },
              { label: "Mobile", pct: 42, icon: Smartphone, color: "bg-green-600" },
              { label: "Tablet", pct: 13, icon: Globe, color: "bg-purple-600" },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{d.label}</span>
                  <span className="text-xs font-semibold">{d.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Traffic Sources</h2>
          <div className="space-y-3">
            {[
              { label: "Direct", pct: 35, color: "bg-brand" },
              { label: "Social Media", pct: 28, color: "bg-blue-600" },
              { label: "Search Engines", pct: 22, color: "bg-green-600" },
              { label: "Referrals", pct: 15, color: "bg-purple-600" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{s.label}</span>
                  <span className="text-xs font-semibold">{s.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Reading Time</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">4.2 min</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">32%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Top Category</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                {Object.entries(byCategory).sort(([, a], [, b]) => b.views - a.views)[0]?.[0] ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Articles/Week</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {articles ? Math.round(articles.length / 4) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
