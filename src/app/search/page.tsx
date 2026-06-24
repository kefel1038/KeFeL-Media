import { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search KeFeL Media for news, topics, and stories from Africa and the world.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-screen-xl mx-auto px-4 py-10 text-gray-500">Loading search...</div>}>
      <SearchClient />
    </Suspense>
  );
}
