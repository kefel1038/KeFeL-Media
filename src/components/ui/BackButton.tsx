"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-2 border border-zinc-700 text-gray-300 font-semibold px-5 py-2.5 rounded-xl hover:border-brand hover:text-brand transition-colors"
    >
      <ArrowLeft size={16} /> Go Back
    </button>
  );
}
