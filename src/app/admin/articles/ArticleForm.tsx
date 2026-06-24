"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { categories } from "@/data/categories";

interface ArticleFormProps {
  initial?: {
    id?: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    authorName: string;
    authorRole: string;
    image: string;
    tags: string;
    featured: boolean;
    trending: boolean;
    publishedAt: string;
    readingTime: number;
  };
}

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function ArticleForm({ initial }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "uganda");
  const [authorName, setAuthorName] = useState(
    initial?.authorName ?? "KeFeL Media"
  );
  const [authorRole, setAuthorRole] = useState(
    initial?.authorRole ?? "Staff Writer"
  );
  const [image, setImage] = useState(initial?.image ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [trending, setTrending] = useState(initial?.trending ?? false);
  const [publishedAt, setPublishedAt] = useState(
    initial?.publishedAt ?? new Date().toISOString().slice(0, 16)
  );
  const [readingTime, setReadingTime] = useState(
    initial?.readingTime ?? 5
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) setSlug(toSlug(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      slug,
      title,
      excerpt,
      content,
      category,
      author: { name: authorName, avatar: "", role: authorRole },
      image,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      featured,
      trending,
      publishedAt: new Date(publishedAt).toISOString(),
      readingTime: Number(readingTime),
    };

    try {
      const url = isEdit
        ? `/api/admin/articles/${initial!.id}`
        : "/api/admin/articles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/articles");
        router.refresh();
      } else {
        setError(data.error || "Failed to save article");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Excerpt / Subtitle
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Article Body (HTML)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand font-mono"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;blockquote&gt;, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Publishing
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Publish Date
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Reading Time (minutes)
              </label>
              <input
                type="number"
                value={readingTime}
                onChange={(e) => setReadingTime(Number(e.target.value))}
                min={1}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Featured
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Trending
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Author
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Role
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Media & Tags
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
              />
              {image && (
                <div className="mt-2 w-full h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = "flex";
                    }}
                  />
                  <div className="absolute inset-0 items-center justify-center text-gray-400 text-xs hidden">
                    Image failed to load
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="technology, innovation, africa"
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? "Saving..." : isEdit ? "Update Article" : "Publish Article"}
        </button>
      </div>
    </form>
  );
}
