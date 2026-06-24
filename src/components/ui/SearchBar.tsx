"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

export default function SearchBar({ onClose, className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 ${className}`}
    >
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search KeFeL Media..."
          autoFocus
          className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand transition-colors"
        />
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
}
