"use client";

import { useState } from "react";
import { searchArticles } from "@/data/articles";
import { Article } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";

export default function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);

  const search = (q: string) => {
    setQuery(q);
    setResults(q.trim().length > 1 ? searchArticles(q) : []);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
  };

  return { query, results, search, clear };
}
