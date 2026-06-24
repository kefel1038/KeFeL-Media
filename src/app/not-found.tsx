"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-brand mb-4">404</div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The story you&apos;re looking for may have been moved, updated, or is no
          longer available on KeFeL Media.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-brand text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold px-5 py-2.5 rounded-xl hover:border-brand hover:text-brand transition-colors"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
