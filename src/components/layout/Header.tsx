"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, User, Bell } from "lucide-react";
import LanguageSelector from "@/components/ui/LanguageSelector";
import LiveClock from "@/components/ui/LiveClock";
import SearchBar from "@/components/ui/SearchBar";
import CategoryNav from "@/components/ui/CategoryNav";

const breakingHeadlines = [
  "Africa's tech startups attract record $5B in global investment this quarter",
  "Uganda announces landmark smart city initiative for Kampala",
  "African Continental Free Trade Area reports 34% surge in intra-continental trade",
  "Nile Basin nations sign historic water-sharing framework agreement",
  "Afrobeats dominates global streaming charts for third consecutive year",
];

const mainNavLinks = [
  { label: "Home", href: "/" },
  { label: "Uganda", href: "/category/uganda" },
  { label: "Africa", href: "/category/africa" },
  { label: "World", href: "/category/world" },
  { label: "Business", href: "/category/business" },
  { label: "Technology", href: "/category/technology" },
  { label: "Sports", href: "/category/sports" },
  { label: "Opinion", href: "/category/opinion" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Utility Bar */}
      <div className="bg-zinc-950 text-white h-10 flex items-center">
        <div className="max-w-screen-xl mx-auto px-4 w-full flex justify-between items-center h-full">
          <div className="flex items-center gap-4 h-full">
            <LanguageSelector />
            <div className="w-px h-4 bg-white/20 hidden md:block" />
            <LiveClock />
          </div>
          <div className="flex items-center h-full">
            <Link
              href="/signin"
              className="flex items-center gap-2 px-3 h-full text-xs font-medium hover:bg-white/10 transition-colors border-l border-white/10"
            >
              <User size={14} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
            <button className="h-full flex items-center px-3 border-l border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <Bell size={16} />
            </button>
            <Link
              href="/subscribe"
              className="bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold px-4 h-full flex items-center uppercase tracking-wider transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)] transition-colors duration-300">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-6 h-full">
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0"
              aria-label="KeFeL Media Home"
            >
              <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-xl leading-none">K</span>
              </div>
              <div className="hidden sm:flex items-baseline gap-[1px]">
                <span className="text-[var(--foreground)] font-black text-2xl tracking-tight font-headline">
                  KEFEL
                </span>
                <span className="text-brand-primary font-black text-2xl">.</span>
                <span className="text-[var(--foreground)] font-black text-2xl tracking-tight font-headline">
                  MEDIA
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center h-full ml-4">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--foreground)] hover:text-brand-primary text-[14px] font-semibold px-3 h-full flex items-center border-b-2 border-transparent hover:border-brand-primary transition-all whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[var(--muted-text)] hover:text-[var(--foreground)] rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              className="lg:hidden p-2 text-[var(--muted-text)] hover:text-[var(--foreground)] rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Expansion */}
        {searchOpen && (
          <div className="border-t border-[var(--card-border)] bg-[var(--background)] px-4 py-4 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          </div>
        )}

        {/* Mobile Menu Expansion */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 transition-colors duration-300">
            <div className="grid grid-cols-2 gap-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--foreground)] hover:text-brand-primary text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
              <Link
                href="/signin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] px-3 py-2.5"
              >
                <User size={16} />
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Category Navigation Ticker */}
      <div className="hidden lg:block">
        <CategoryNav />
      </div>

      {/* Breaking News Ticker */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-[var(--card-border)] overflow-hidden h-9 flex items-center transition-colors duration-300">
        <div className="flex items-center h-full w-full">
          <div className="flex-shrink-0 bg-brand-primary h-full flex items-center px-4 z-10 relative">
            <span className="text-white text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">
              Breaking
            </span>
            <div className="absolute right-[-10px] top-0 w-0 h-0 border-t-[18px] border-t-transparent border-l-[10px] border-l-brand-primary border-b-[18px] border-b-transparent" />
          </div>
          <div className="flex-1 overflow-hidden relative h-full flex items-center ml-4">
            <div className="flex gap-0 items-center">
              <div
                className="flex gap-10 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap items-center"
                aria-live="polite"
              >
                {[...breakingHeadlines, ...breakingHeadlines].map((headline, i) => (
                  <Link
                    href="#"
                    key={i}
                    className="text-[var(--foreground)] hover:text-brand-primary text-[13px] font-medium flex-shrink-0 inline-flex items-center gap-3 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0 animate-pulse" />
                    {headline}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
