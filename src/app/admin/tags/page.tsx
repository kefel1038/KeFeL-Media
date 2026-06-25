"use client";

import { useState } from "react";
import { Plus, X, Hash } from "lucide-react";

export default function TagsPage() {
  const [tags, setTags] = useState(["Politics", "Economy", "Technology", "Sports", "Health", "Education", "Africa", "Uganda", "World"]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setNewTag("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Tags</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tags.length} tags</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Add a new tag..."
            className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
          />
          <button onClick={addTag} disabled={!newTag.trim()} className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
            <Plus size={16} />
            Add Tag
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="group inline-flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1.5 rounded-full">
              <Hash size={12} className="text-gray-400" />
              {tag}
              <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
