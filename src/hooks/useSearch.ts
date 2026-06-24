"use client";

import { useState } from "react";
import { searchArticles } from "@/data/articles";
import { Article } from "@/lib/types";

export default function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);

  const search = async (q: string) => {
    setQuery(q);
    if (q.trim().length > 1) {
      const res = await searchArticles(q);
      setResults(res);
    } else {
      setResults([]);
    }
  };

  const clear = () => {
    setQuery("");
    setResults([]);
  };

  return { query, results, search, clear };
}
