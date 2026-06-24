import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { Plus, FileText, Eye } from "lucide-react";

export default async function AdminDashboard() {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("id,title,category,views,created_at,slug")
    .order("created_at", { ascending: false });

  const total = articles?.length ?? 0;
  const totalViews = articles?.reduce((s, a) => s + (a.views ?? 0), 0) ?? 0;
  const byCategory: Record<string, number> = {};
  for (const a of articles ?? []) {
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
  }
  const recent = articles?.slice(0, 5) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <Link
          href="/admin/articles/new"
          className="bg-brand hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Write New Story
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <FileText size={20} className="text-brand" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {total}
              </p>
              <p className="text-xs text-gray-500">Total Articles</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Eye size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Views</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {Object.keys(byCategory).length}
              </p>
              <p className="text-xs text-gray-500">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 mb-8">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">
          Articles by Category
        </h2>
        <div className="space-y-2">
          {Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => (
              <div
                key={cat}
                className="flex items-center justify-between text-sm"
              >
                <span className="capitalize text-gray-700 dark:text-gray-300">
                  {cat}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">
          Recent Articles
        </h2>
        <div className="space-y-3">
          {recent.map((a) => (
            <Link
              key={a.id}
              href={`/admin/articles/${a.id}/edit`}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 -mx-5 px-5 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {a.title}
                </p>
                <p className="text-xs text-gray-500 capitalize">{a.category}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {a.views?.toLocaleString()} views
              </span>
            </Link>
          ))}
          {recent.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No articles yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
