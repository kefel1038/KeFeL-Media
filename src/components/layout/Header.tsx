"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Moon, Sun, Menu, X, ChevronDown, Tv, Headphones, Radio } from "lucide-react";
import { categories } from "@/data/categories";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchBar from "@/components/ui/SearchBar";

const breakingHeadlines = [
  "Africa's tech startups attract record $5B in global investment this quarter",
  "Uganda announces landmark smart city initiative for Kampala",
  "African Continental Free Trade Area reports 34% surge in intra-continental trade",
  "Nile Basin nations sign historic water-sharing framework agreement",
  "Afrobeats dominates global streaming charts for third consecutive year",
  "Africa Climate Summit 2026: Leaders commit to ambitious green energy targets",
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % breakingHeadlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Latest News", href: "/latest" },
    { label: "Uganda", href: "/uganda" },
    { label: "Africa", href: "/africa" },
    { label: "World", href: "/world" },
    { label: "Business", href: "/business" },
    { label: "Technology", href: "/technology" },
    { label: "Entertainment", href: "/entertainment" },
    { label: "Sports", href: "/sports" },
    { label: "Opinion", href: "/opinion" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main Navbar */}
      <nav className="bg-[#111111] border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
              <span className="text-white font-black text-lg leading-none">K</span>
            </div>
            <div className="flex items-baseline gap-[2px]">
              <span className="text-white font-black text-xl tracking-tight">KEFEL</span>
              <span className="text-brand font-black text-xl">.</span>
              <span className="text-white font-black text-xl tracking-tight">MEDIA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white text-[13px] font-medium px-3 py-1.5 rounded hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <ThemeToggle />
            <Link
              href="/subscribe"
              className="hidden sm:flex items-center gap-1 bg-brand hover:bg-brand-dark text-white text-[13px] font-semibold px-4 py-2 rounded transition-colors"
            >
              Subscribe
            </Link>
            <button
              className="xl:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-[#111111] px-4 py-3">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 bg-[#111111] px-4 py-3 grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2 rounded hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Breaking News Ticker */}
      <div className="bg-[#0a0a0a] border-b border-brand/30 flex items-center h-9 overflow-hidden">
        <div className="flex-shrink-0 bg-brand px-3 h-full flex items-center">
          <span className="text-white text-[11px] font-black tracking-wider uppercase whitespace-nowrap">
            Breaking News
          </span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
          <p
            key={tickerIndex}
            className="text-gray-300 text-[13px] truncate animate-fade-in"
          >
            {breakingHeadlines[tickerIndex]}
          </p>
        </div>
        <div className="flex-shrink-0 pr-3">
          <div className="flex gap-1">
            {breakingHeadlines.map((_, i) => (
              <button
                key={i}
                onClick={() => setTickerIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === tickerIndex ? "bg-brand" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
