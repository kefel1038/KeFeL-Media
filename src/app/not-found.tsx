import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-brand mb-4">404</div>
        <h1 className="text-3xl font-black text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try searching for what you need, or head back to the homepage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-brand text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-dark transition-colors"
          >
            <Home size={16} /> Go Home
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 bg-zinc-800 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-700 border border-zinc-700 transition-colors"
          >
            <Search size={16} /> Search
          </Link>
        </div>
      </div>
    </div>
  );
}
