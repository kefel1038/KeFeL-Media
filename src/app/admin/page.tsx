import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import {
  Plus,
  FileText,
  Eye,
  TrendingUp,
  Calendar,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { getCategoryColor } from "@/data/categories";
import ContentCalendar from "@/components/admin/ContentCalendar";
import QuickPublish from "@/components/admin/QuickPublish";
import NotificationsPanel from "@/components/admin/NotificationsPanel";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        {sub && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
            <ArrowUpRight size={10} />
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("id,title,category,views,created_at,published_at,slug,author")
    .order("created_at", { ascending: false });

  const total = articles?.length ?? 0;
  const totalViews = articles?.reduce((s, a) => s + (a.views ?? 0), 0) ?? 0;
  const today = new Date().toISOString().slice(0, 10);
  const publishedToday = articles?.filter(
    (a) => a.published_at?.startsWith(today)
  ).length ?? 0;

  const byCategory: Record<string, number> = {};
  for (const a of articles ?? []) {
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
  }
  const categoryEntries = Object.entries(byCategory).sort(([, a], [, b]) => b - a);

  const topViews = [...(articles ?? [])]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5);

  const authorCount = new Set(
    articles?.map((a) =>
      typeof a.author === "string"
        ? JSON.parse(a.author).name
        : a.author?.name ?? ""
    ).filter(Boolean)
  ).size;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Newsroom overview &amp; performance</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Write New Story
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCard icon={FileText} label="Total Articles" value={total.toLocaleString()} color="bg-brand" />
        <StatCard icon={Eye} label="Total Views" value={totalViews.toLocaleString()} sub="+12%" color="bg-blue-600" />
        <StatCard icon={Calendar} label="Published Today" value={String(publishedToday)} color="bg-emerald-600" />
        <StatCard icon={Users} label="Authors" value={String(authorCount)} color="bg-purple-600" />
        <StatCard icon={TrendingUp} label="Categories" value={String(categoryEntries.length)} color="bg-cyan-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Articles by Category</h2>
          <div className="space-y-2">
            {categoryEntries.map(([cat, count]) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getCategoryColor(cat).replace("bg-", "#") }} />
                  <span className="flex-1 text-sm capitalize text-gray-700 dark:text-gray-300">{cat}</span>
                  <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                  <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Read */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Most Read Stories</h2>
          <div className="space-y-3">
            {topViews.map((a, i) => (
              <Link
                key={a.id}
                href={`/admin/articles/${a.id}/edit`}
                className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0 group"
              >
                <span className="text-lg font-black text-gray-300 dark:text-zinc-700 w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand transition-colors">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{a.category}</p>
                </div>
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
                  {(a.views ?? 0).toLocaleString()}
                </span>
              </Link>
            ))}
            {topViews.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No articles yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm">Recent Articles</h2>
          <Link href="/admin/articles" className="text-xs text-brand font-semibold hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {articles?.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={`/admin/articles/${a.id}/edit`}
              className="flex items-center justify-between py-2.5 px-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 capitalize">{a.category}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {(a.views ?? 0).toLocaleString()} views
              </span>
            </Link>
          ))}
          {(!articles || articles.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">No articles yet.</p>
          )}
        </div>
      </div>

      {/* Content Calendar */}
      <div className="mt-8">
        <ContentCalendar articles={(articles ?? []).map((a: Record<string, unknown>) => ({
          id: String(a.id),
          title: String(a.title),
          slug: String(a.slug ?? ""),
          category: String(a.category),
          status: String(a.status ?? "draft"),
          scheduled_at: a.scheduled_at ? String(a.scheduled_at) : undefined,
          published_at: a.published_at ? String(a.published_at) : undefined,
        }))} />
      </div>

      {/* Quick Publish + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <QuickPublish
          drafts={(articles ?? [])
            .filter((a: Record<string, unknown>) => (a.status ?? "draft") === "draft")
            .slice(0, 5)
            .map((a: Record<string, unknown>) => ({
              id: String(a.id),
              title: String(a.title),
              category: String(a.category),
              status: String(a.status ?? "draft"),
              updated_at: String(a.created_at ?? ""),
            }))}
        />
        <NotificationsPanel notifications={[]} />
      </div>
    </div>
  );
}
