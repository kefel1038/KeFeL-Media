"use client";

import { useState } from "react";
import { Sparkles, Wand2, Type, AlignLeft, Hash, List } from "lucide-react";

interface AIEditorToolsProps {
  content: string;
  excerpt: string;
  title: string;
  onUpdateContent: (val: string) => void;
  onUpdateExcerpt: (val: string) => void;
  onUpdateTitle: (val: string) => void;
}

type ToolId = "grammar" | "rewrite" | "engage" | "shorten" | "paragraphs" | "headline" | "summary" | "subheadings" | "readingTime";

const tools: { id: ToolId; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "grammar", label: "Improve Grammar", icon: Wand2, desc: "Fix spelling & grammar" },
  { id: "rewrite", label: "Rewrite Professionally", icon: Type, desc: "Professional tone" },
  { id: "engage", label: "Make More Engaging", icon: Sparkles, desc: "Boost reader interest" },
  { id: "shorten", label: "Shorten Article", icon: AlignLeft, desc: "Condense to key points" },
  { id: "paragraphs", label: "Break Into Paragraphs", icon: Type, desc: "Short paragraphs for mobile" },
  { id: "headline", label: "Generate Headline", icon: Hash, desc: "SEO headline suggestions" },
  { id: "summary", label: "Generate Summary", icon: List, desc: "Create excerpt" },
  { id: "subheadings", label: "Add Subheadings", icon: List, desc: "Insert section breaks" },
  { id: "readingTime", label: "Calculate Reading Time", icon: Type, desc: "Auto-detect read time" },
];

const labels: Record<ToolId, string> = {
  grammar: "Grammar checked ✓",
  rewrite: "Rewritten professionally ✓",
  engage: "Made more engaging ✓",
  shorten: "Article shortened ✓",
  paragraphs: "Broken into paragraphs ✓",
  headline: "Headline generated ✓",
  summary: "Summary generated ✓",
  subheadings: "Subheadings added ✓",
  readingTime: "Reading time calculated ✓",
};

export default function AIEditorTools({ content, excerpt, title, onUpdateContent, onUpdateExcerpt, onUpdateTitle }: AIEditorToolsProps) {
  const [active, setActive] = useState<ToolId | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleTool = async (id: ToolId) => {
    setActive(id);
    setFeedback("");
    setError("");

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: id, content, excerpt, title }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "AI request failed");
        setActive(null);
        return;
      }

      if (data.result.content) onUpdateContent(data.result.content);
      if (data.result.excerpt) onUpdateExcerpt(data.result.excerpt);
      if (data.result.title) onUpdateTitle(data.result.title);

      setFeedback(labels[id]);
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setActive(null);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-3">
      <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
        <Sparkles size={14} className="text-brand" />
        AI Editor Tools
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isLoading = active === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleTool(tool.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 text-left"
            >
              <Icon size={12} className={isLoading ? "animate-spin text-brand" : "text-gray-400"} />
              <span>{isLoading ? "Processing..." : tool.label}</span>
            </button>
          );
        })}
      </div>
      {feedback && (
        <p className="text-xs text-green-600 font-medium">{feedback}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
