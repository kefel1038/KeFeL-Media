"use client";

import { useState } from "react";
import { Upload, Search, Image, Film, FileText, X } from "lucide-react";

const folders = [
  { slug: "politics", label: "Politics", count: 12 },
  { slug: "business", label: "Business", count: 8 },
  { slug: "technology", label: "Technology", count: 15 },
  { slug: "sports", label: "Sports", count: 6 },
  { slug: "entertainment", label: "Entertainment", count: 10 },
];

const recentUploads = [
  { name: "tech-summit.jpg", type: "image", size: "2.4 MB", date: "2 hours ago" },
  { name: "sports-highlight.mp4", type: "video", size: "14 MB", date: "5 hours ago" },
  { name: "interview-clip.mp3", type: "audio", size: "5.1 MB", date: "1 day ago" },
];

function FileIcon({ type }: { type: string }) {
  if (type === "image") return <Image size={16} className="text-blue-500" />;
  if (type === "video") return <Film size={16} className="text-purple-500" />;
  return <FileText size={16} className="text-gray-500" />;
}

export default function MediaPage() {
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage images, videos, and documents</p>
        </div>
        <label className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
          <Upload size={16} />
          Upload Media
          <input type="file" multiple className="hidden" accept="image/*,video/*,.pdf" />
        </label>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveFolder("all")}
          className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            activeFolder === "all" ? "bg-brand text-white" : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800"
          }`}
        >
          All Media
        </button>
        {folders.map((f) => (
          <button
            key={f.slug}
            onClick={() => setActiveFolder(f.slug)}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeFolder === f.slug ? "bg-brand text-white" : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800"
            }`}
          >
            {f.label}
            <span className="text-[10px] opacity-60">({f.count})</span>
          </button>
        ))}
      </div>

      <div className="relative max-w-md mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media..."
          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="group relative bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden aspect-[4/3] cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Image size={24} />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {recentUploads.map((file) => (
            <div key={file.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                  <FileIcon type={file.type} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{file.size} · {file.date}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
