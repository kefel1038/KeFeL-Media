"use client";

import { useState, useCallback } from "react";
import {
  Send,
  Check,
  Clock,
  AlertTriangle,
  Loader2,
  FileCheck,
  Eye,
} from "lucide-react";

interface Draft {
  id: string;
  title: string;
  category: string;
  status: string;
  updated_at: string;
}

interface QuickPublishProps {
  drafts: Draft[];
}

export default function QuickPublish({ drafts }: QuickPublishProps) {
  const [publishing, setPublishing] = useState<string | null>(null);
  const [published, setPublished] = useState<Set<string>>(new Set());

  const handlePublish = useCallback(async (articleId: string) => {
    setPublishing(articleId);
    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "published",
          published_at: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setPublished((prev) => new Set(prev).add(articleId));
      }
    } catch {
      // silent
    } finally {
      setPublishing(null);
    }
  }, []);

  if (drafts.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileCheck size={16} className="text-green-400" />
          <h3 className="text-sm font-bold text-white">Quick Publish</h3>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">
          No drafts ready for publishing
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FileCheck size={16} className="text-green-400" />
          <h3 className="text-sm font-bold text-white">Quick Publish</h3>
        </div>
        <span className="text-[10px] text-gray-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {drafts.length} draft{drafts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="divide-y divide-zinc-800">
        {drafts.map((draft) => {
          const isPublished = published.has(draft.id);
          const isPublishing = publishing === draft.id;

          return (
            <div key={draft.id} className="px-5 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {isPublished ? (
                    <span className="text-green-400">{draft.title}</span>
                  ) : (
                    draft.title
                  )}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 capitalize">{draft.category}</span>
                  <span className="text-[10px] text-gray-600">·</span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock size={9} />
                    {new Date(draft.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isPublished ? (
                <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                  <Check size={14} /> Published
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <a
                    href={`/admin/articles/${draft.id}/edit`}
                    className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Preview"
                  >
                    <Eye size={14} />
                  </a>
                  <button
                    onClick={() => handlePublish(draft.id)}
                    disabled={isPublishing}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-brand hover:bg-brand-dark text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                    Publish
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
