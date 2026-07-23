"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchArticles } from "@/data/articles";
import { Article } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";
import { Search, SlidersHorizontal, X, Clock, TrendingUp } from "lucide-react";
import { categories } from "@/data/categories";

type SortBy = "relevance" | "newest" | "oldest" | "popular";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "relevance", label: "Most Relevant" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Read" },
];

const QUICK_TOPICS = [
  "Technology", "Politics", "Business", "Sports",
  "Entertainment", "AI", "Uganda", "Africa",
];

function sortResults(articles: Article[], sortBy: SortBy): Article[] {
  const sorted = [...articles];
  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    case "popular":
      return sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    default:
      return sorted;
  }
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(q);
  const [results, setResults] = useState<Article[]>([]);
  const [allResults, setAllResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const doSearch = useCallback(async (query: string) => {
    if (!query) {
      setResults([]);
      setAllResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchArticles(query);
      setAllResults(res);
      setResults(res);
    } catch {
      setResults([]);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (q) {
      setInputValue(q);
      doSearch(q);
    }
  }, [q, doSearch]);

  useEffect(() => {
    let filtered = allResults;
    if (categoryFilter) {
      filtered = filtered.filter((a) => a.category === categoryFilter);
    }
    setResults(sortResults(filtered, sortBy));
  }, [sortBy, categoryFilter, allResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setSortBy("relevance");
  };

  const hasActiveFilters = categoryFilter || sortBy !== "relevance";

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl font-black text-white mb-2 font-headline">
          Search KeFeL Media
        </h1>
        <p className="text-gray-500 text-sm">
          Find news, analysis, and stories from across Africa and the world
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for news, topics, people..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick topics */}
        {!q && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">Quick topics</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(topic)}`)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {q && (
        <div>
          {/* Results header with filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-gray-400">
              {loading ? (
                "Searching..."
              ) : (
                <>
                  <span className="font-semibold text-white">{results.length}</span>
                  {" "}result{results.length !== 1 ? "s" : ""} for{" "}
                  <span className="font-semibold text-white">&ldquo;{q}&rdquo;</span>
                </>
              )}
            </p>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-brand hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  showFilters || hasActiveFilters
                    ? "bg-brand/10 border-brand/30 text-brand"
                    : "bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 flex flex-wrap gap-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium block mb-1.5">
                  Category
                </label>
                <select
                  value={categoryFilter || ""}
                  onChange={(e) => setCategoryFilter(e.target.value || null)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-brand"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium block mb-1.5">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-brand"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Results grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-64 skeleton-shimmer" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} variant="trending" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-xl font-bold text-white mb-2">No results found</p>
              <p className="text-gray-500 text-sm mb-6">
                Try different keywords or browse our categories
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_TOPICS.slice(0, 4).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(topic)}`)}
                    className="px-4 py-2 text-sm font-medium text-brand bg-brand/10 border border-brand/20 rounded-lg hover:bg-brand/20 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!q && (
        <div className="text-center py-16">
          <Search size={64} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg">Start typing to search</p>
        </div>
      )}
    </div>
  );
}
