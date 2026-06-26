"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, FileEdit, Eye, Send, Plus, X, Sparkles, Search, BarChart3, Layout, ChevronDown, ChevronUp, Upload, Code, LayoutTemplate } from "lucide-react";
import { categories } from "@/data/categories";
import { calculateReadingTime } from "@/lib/utils";
import slugify from "slugify";
import ArticleTemplates from "./ArticleTemplates";
import ArticleSEO from "./ArticleSEO";
import AIEditorTools from "./AIEditorTools";
import QualityScore from "./QualityScore";
import BlockEditor from "@/components/editor/BlockEditor";

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
    imageCaption?: string;
    imageCredit?: string;
    tags: string;
    featured: boolean;
    trending: boolean;
    status?: string;
    publishedAt: string;
    readingTime: number;
    highlights?: string[];
    articleType?: string;
  };
}

const statuses = [
  { value: "draft", label: "Draft", icon: FileEdit },
  { value: "pending", label: "Pending Review", icon: Eye },
  { value: "published", label: "Published", icon: Send },
];

type Tab = "content" | "media" | "seo" | "ai" | "quality";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "content", label: "Content", icon: FileEdit },
  { id: "media", label: "Media", icon: Save },
  { id: "seo", label: "SEO", icon: Search },
  { id: "ai", label: "AI Tools", icon: Sparkles },
  { id: "quality", label: "Quality", icon: BarChart3 },
];

function toSlug(text: string) {
  return slugify(text, { lower: true, strict: true });
}

export default function ArticleForm({ initial }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [tab, setTab] = useState<Tab>("content");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "uganda");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "KeFeL Media");
  const [authorRole, setAuthorRole] = useState(initial?.authorRole ?? "Staff Writer");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageCaption, setImageCaption] = useState(initial?.imageCaption ?? "");
  const [imageCredit, setImageCredit] = useState(initial?.imageCredit ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [trending, setTrending] = useState(initial?.trending ?? false);
  const [breaking, setBreaking] = useState(false);
  const [highlights, setHighlights] = useState<string[]>(initial?.highlights ?? []);
  const [highlightInput, setHighlightInput] = useState("");
  const [publishedAt, setPublishedAt] = useState(initial?.publishedAt ?? new Date().toISOString().slice(0, 16));
  const [readingTime, setReadingTime] = useState(initial?.readingTime ?? calculateReadingTime(initial?.content ?? ""));
  const [articleType, setArticleType] = useState(initial?.articleType ?? "news");
  const [template, setTemplate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tplOpen, setTplOpen] = useState(false);
  const [useBlockEditor, setUseBlockEditor] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) setSlug(toSlug(val));
  };

  const handleTemplateSelect = (tpl: { title: string; excerpt: string; content: string; category: string; tags: string }, tplId?: string) => {
    if (!isEdit && tpl.title) setTitle(tpl.title);
    if (!isEdit && tpl.title) setSlug(toSlug(tpl.title));
    setExcerpt(tpl.excerpt);
    setContent(tpl.content);
    setCategory(tpl.category);
    setTags(tpl.tags);
    setTemplate(tplId ?? "");
    setReadingTime(calculateReadingTime(tpl.content));
    setTplOpen(false);
    setTab("content");
  };

  const addHighlight = () => {
    const h = highlightInput.trim();
    if (h && !highlights.includes(h)) {
      setHighlights([...highlights, h]);
      setHighlightInput("");
    }
  };

  const removeHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent, publishStatus: string) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      slug,
      title,
      excerpt,
      content,
      category,
      status: publishStatus,
      author: { name: authorName, avatar: "", role: authorRole },
      image,
      imageCaption,
      imageCredit,
      highlights,
      template,
      articleType,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      featured,
      trending,
      breaking,
      publishedAt: new Date(publishedAt).toISOString(),
      readingTime: Number(readingTime),
    };

    try {
      const url = isEdit ? `/api/admin/articles/${initial!.id}` : "/api/admin/articles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
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

  const currentStatus = statuses.find((s) => s.value === status) ?? statuses[0];
  const StatusIcon = currentStatus.icon;

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-gray-900 dark:text-white">
            {isEdit ? "Edit Article" : "New Article"}
          </h1>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            status === "published" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
            status === "pending" ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" :
            "bg-gray-100 dark:bg-zinc-800 text-gray-500"
          }`}>
            <StatusIcon size={11} />
            {currentStatus.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={saving}
            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
            <FileEdit size={14} />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, status)} disabled={saving}
            className="bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save size={14} />
            {saving ? "Saving..." : isEdit ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-zinc-800 pb-px">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                tab === t.id
                  ? "border-brand text-brand bg-brand/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Template picker */}
      {!isEdit && (
        <div>
          <button type="button" onClick={() => setTplOpen(!tplOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-brand transition-colors">
            <Layout size={13} />
            {tplOpen ? "Hide templates" : "Start from template"}
            {tplOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {tplOpen && (
            <div className="mt-3">
              <ArticleTemplates onSelect={handleTemplateSelect} />
            </div>
          )}
        </div>
      )}

      {/* Tab: Content */}
      {tab === "content" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Article Content</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Headline</label>
                <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                  placeholder="Enter article headline..." required />
                <p className="text-[10px] text-gray-400 mt-1">{title.length}/70 characters</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(toSlug(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand font-mono" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Excerpt / Lead Paragraph</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                  placeholder="Answer: Who? What? When? Where? Why? Keep under 160 chars..." required />
                <p className="text-[10px] text-gray-400 mt-1">{excerpt.length}/160 characters · Lead should answer the 5 Ws</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">Article Body</label>
                  <button
                    type="button"
                    onClick={() => setUseBlockEditor(!useBlockEditor)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-brand transition-colors"
                  >
                    {useBlockEditor ? <Code size={12} /> : <LayoutTemplate size={12} />}
                    {useBlockEditor ? "Raw HTML" : "Block Editor"}
                  </button>
                </div>
                {useBlockEditor ? (
                  <BlockEditor value={content} onChange={(html) => { setContent(html); setReadingTime(calculateReadingTime(html)); }} />
                ) : (
                  <textarea value={content} onChange={(e) => { setContent(e.target.value); setReadingTime(calculateReadingTime(e.target.value)); }} rows={20}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand font-mono leading-relaxed"
                    required />
                )}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-gray-400">Supports: paragraph, heading, quote, image, bullets, highlight box</p>
                  <p className="text-[10px] text-gray-400">{readingTime} min read</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Key Points / Highlights</label>
                <div className="flex items-center gap-2 mb-2">
                  <input type="text" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                    placeholder="Add a key point..."
                    className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-3 py-1.5 text-xs focus:outline-none focus:border-brand" />
                  <button type="button" onClick={addHighlight} disabled={!highlightInput.trim()}
                    className="p-1.5 rounded-lg bg-brand text-white disabled:opacity-50">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-brand/10 text-brand text-[11px] font-medium px-2 py-1 rounded-full">
                      {h}
                      <button type="button" onClick={() => removeHighlight(i)} className="hover:text-red-500"><X size={11} /></button>
                    </span>
                  ))}
                  {highlights.length === 0 && <span className="text-[10px] text-gray-400 italic">Add 3-5 key points for the highlights box</span>}
                </div>
              </div>
            </div>

            {/* Status + Publishing sidebar within content tab on mobile */}
            <div className="lg:hidden bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Publishing Settings</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-brand">
                    {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-brand">
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Article Type</label>
                  <select value={articleType} onChange={(e) => setArticleType(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-brand">
                    <option value="news">News</option>
                    <option value="feature">Feature</option>
                    <option value="opinion">Opinion</option>
                    <option value="analysis">Analysis</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block space-y-5">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Publishing</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                  {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Article Type</label>
                <select value={articleType} onChange={(e) => setArticleType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                  <option value="news">News</option>
                  <option value="feature">Feature</option>
                  <option value="opinion">Opinion</option>
                  <option value="analysis">Analysis</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Publish Date</label>
                <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Reading Time (min)</label>
                <input type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} min={1}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Author</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Role</label>
                <input type="text" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Flags</h3>
              {[
                { label: "Featured Article", key: featured, set: setFeatured },
                { label: "Trending", key: trending, set: setTrending },
                { label: "Breaking News", key: breaking, set: setBreaking },
              ].map((f) => (
                <label key={f.label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={f.key} onChange={(e) => f.set(e.target.checked)}
                    className="rounded border-gray-300 text-brand focus:ring-brand" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{f.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Media */}
      {tab === "media" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Cover Image</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Image URL</label>
              <div className="flex gap-2">
                <input type="url" value={image} onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
                <label className="bg-brand hover:bg-brand-dark text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors flex-shrink-0">
                  <Upload size={14} />
                  Upload
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("file", file);
                    try {
                      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
                      const data = await res.json();
                      if (data.success) setImage(data.url);
                    } catch { /* ignore */ }
                    e.target.value = "";
                  }} />
                </label>
              </div>
              {image && (
                <div className="mt-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 aspect-video relative">
                  <img src={image} alt="Preview" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Image Caption</label>
              <input type="text" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Brief description of the image"
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Image Credit</label>
              <input type="text" value={imageCredit} onChange={(e) => setImageCredit(e.target.value)}
                placeholder="Photo: Name / Source"
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Tags</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Tags (comma-separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  placeholder="technology, innovation, africa"
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.split(",").filter(Boolean).map((t, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{t.trim()}</span>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Author</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Role</label>
                <input type="text" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: SEO */}
      {tab === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">SEO Settings</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Meta Title</label>
                <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
                <p className="text-[10px] text-gray-400 mt-1">{title.length}/60 chars · Google shows ~60 chars</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Meta Description</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
                <p className="text-[10px] text-gray-400 mt-1">{excerpt.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Slug / URL</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono shrink-0">/article/</span>
                  <input type="text" value={slug} onChange={(e) => setSlug(toSlug(e.target.value))}
                    className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand font-mono" />
                </div>
              </div>
            </div>
            <ArticleTemplates onSelect={handleTemplateSelect} />
          </div>
          <ArticleSEO title={title} excerpt={excerpt} slug={slug} image={image} tags={tags} content={content} />
        </div>
      )}

      {/* Tab: AI Tools */}
      {tab === "ai" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIEditorTools
            content={content}
            excerpt={excerpt}
            title={title}
            onUpdateContent={setContent}
            onUpdateExcerpt={setExcerpt}
            onUpdateTitle={(val) => { setTitle(val); if (!isEdit) setSlug(toSlug(val)); }}
          />
          <div className="space-y-5">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Writing Tips</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Keep paragraphs to 2-4 sentences max
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Lead paragraph must answer: Who? What? When? Where? Why?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Use active voice — "President signed" not "was signed"
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Add subheadings every 3-4 paragraphs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Include quotes from sources
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Short sentences — aim for 15-20 words max
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  One idea per paragraph
                </li>
              </ul>
            </div>
            <QualityScore title={title} excerpt={excerpt} content={content} tags={tags} />
          </div>
        </div>
      )}

      {/* Tab: Quality */}
      {tab === "quality" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QualityScore title={title} excerpt={excerpt} content={content} tags={tags} />
          <ArticleSEO title={title} excerpt={excerpt} slug={slug} image={image} tags={tags} content={content} />
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <ArticleTemplates onSelect={handleTemplateSelect} />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
            <FileEdit size={14} />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, status)} disabled={saving}
            className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save size={14} />
            {saving ? "Saving..." : isEdit ? "Update Article" : "Publish"}
          </button>
        </div>
      </div>
    </form>
  );
}
