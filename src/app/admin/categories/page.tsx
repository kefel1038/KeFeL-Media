import { categories } from "@/data/categories";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.slug} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${cat.color}`} />
              <h3 className="font-bold text-gray-900 dark:text-white">{cat.label}</h3>
            </div>
            <p className="text-xs text-gray-500">{cat.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Slug: <code className="font-mono bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{cat.slug}</code>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
