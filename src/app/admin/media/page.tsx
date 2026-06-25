"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Search, Image, X, ExternalLink, Copy, Trash2 } from "lucide-react";

interface MediaFile {
  name: string;
  url: string;
  created_at: string;
  size: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

function getFileType(name: string): "image" | "video" | "document" {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (["mp4", "webm", "avi", "mov"].includes(ext)) return "video";
  return "document";
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<MediaFile | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success) setFiles(data.files);
    } catch {
      console.error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => [{ name: data.path.split("/").pop(), url: data.url, created_at: new Date().toISOString(), size: file.size }, ...prev]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (path: string) => {
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => prev.filter((f) => !f.url.includes(path)));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const imageCount = files.filter((f) => getFileType(f.name) === "image").length;
  const videoCount = files.filter((f) => getFileType(f.name) === "video").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {files.length} files · {imageCount} images · {videoCount} videos
          </p>
        </div>
        <label className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Media"}
          <input type="file" multiple={false} className="hidden" accept="image/*,video/*,.pdf" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="relative max-w-md mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media..."
          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading media...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Image size={32} className="mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">No media files yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">Upload images, videos, or documents to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {filtered.map((f) => {
            const type = getFileType(f.name);
            if (type !== "image") return null;
            return (
              <div key={f.name} className="group relative bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden aspect-[4/3] cursor-pointer"
                onClick={() => setPreview(f)}>
                <img src={f.url} alt={f.name} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg">Preview</button>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(f.name); }}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">All Files</h3>
          <div className="space-y-3">
            {filtered.slice(0, 20).map((file) => (
              <div key={file.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Image size={14} className="text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(file.size)} · {formatDate(file.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => copyUrl(file.url)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand hover:bg-brand/10 transition-colors" title="Copy URL">
                    <Copy size={14} />
                  </button>
                  <a href={file.url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand hover:bg-brand/10 transition-colors" title="Open">
                    <ExternalLink size={14} />
                  </a>
                  <button onClick={() => handleDelete(file.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{preview.name}</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <img src={preview.url} alt={preview.name} className="w-full rounded-lg max-h-[60vh] object-contain bg-gray-100 dark:bg-zinc-800" />
            </div>
            <div className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-zinc-800">
              <button onClick={() => copyUrl(preview.url)}
                className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Copy size={14} /> Copy URL
              </button>
              <button onClick={() => handleDelete(preview.name)}
                className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
