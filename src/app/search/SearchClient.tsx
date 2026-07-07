"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchArticles } from "@/data/articles";
import { Article } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";
import { Search } from "lucide-react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const [results, setResults] = useState<Article[]>([]);
  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    if (q) {
      setInputValue(q);
      searchArticles(q).then(setResults);
    }
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="max-w-2xl mb-10">
        <h1 className="text-3xl font-black text-white mb-6">
          Search KeFeL Media
        </h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for news, topics, people..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-brand hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {q && (
        <div>
          <p className="text-sm text-gray-500 mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
            <span className="font-semibold text-white">
              &ldquo;{q}&rdquo;
            </span>
          </p>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} variant="trending" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl font-bold text-white mb-2">
                No results found
              </p>
              <p className="text-gray-500">
                Try different keywords or browse our categories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
