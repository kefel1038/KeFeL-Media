import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import DeleteButton from "./DeleteButton";

export default async function AdminArticlesPage() {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Articles
        </h1>
        <Link
          href="/admin/articles/new"
          className="bg-brand hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          New Article
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">
                  Title
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">
                  Views
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">
                  Date
                </th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {articles?.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-brand transition-colors line-clamp-1"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 capitalize text-gray-600 dark:text-gray-400">
                    {a.category}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {a.views?.toLocaleString() ?? 0}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {new Date(a.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/article/${a.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand hover:bg-brand/10 transition-colors"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      <DeleteButton id={a.id} title={a.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!articles || articles.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-500 text-sm"
                  >
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
