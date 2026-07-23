"use client";

import { Globe } from "lucide-react";

export default function LanguageSelector() {
  return (
    <button className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
      <Globe size={18} />
      <span className="text-xs font-medium uppercase hidden md:inline-block">EN</span>
    </button>
  );
}
