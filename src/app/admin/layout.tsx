"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  LogOut,
  Menu,
  X,
  FolderTree,
  Tags,
  Image,
  Users,
  BarChart3,
  MessageSquare,
  Mail,
  DollarSign,
  Settings,
  Zap,
  TrendingUp,
  Bot,
} from "lucide-react";
import { canManageArticles, canPublishArticles, canManageMedia, canManageNewsletter, canManageBreakingNews, canManageUsers, canManageSettings } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  check?: (role: Role) => boolean;
};

const navSections: { heading: string; items: NavItem[] }[] = [
  {
    heading: "AI Newsroom",
    items: [
      { href: "/admin/newsroom", label: "AI Newsroom", icon: Bot, badge: "NEW" },
    ],
  },
  {
    heading: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/articles", label: "Articles", icon: FileText, check: canManageArticles },
      { href: "/admin/articles/new", label: "New Article", icon: Plus, check: canPublishArticles },
    ],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/categories", label: "Categories", icon: FolderTree, check: canManageArticles },
      { href: "/admin/tags", label: "Tags", icon: Tags, check: canManageArticles },
      { href: "/admin/media", label: "Media Library", icon: Image, check: canManageMedia },
    ],
  },
  {
    heading: "Engagement",
    items: [
      { href: "/admin/breaking", label: "Breaking News", icon: Zap, check: canManageBreakingNews },
      { href: "/admin/trending", label: "Trending", icon: TrendingUp, check: canManageBreakingNews },
      { href: "/admin/comments", label: "Comments", icon: MessageSquare, check: canManageNewsletter },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail, check: canManageNewsletter },
    ],
  },
  {
    heading: "Management",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/users", label: "Users", icon: Users, check: canManageUsers },
      { href: "/admin/advertisements", label: "Advertisements", icon: DollarSign, check: canManageSettings },
      { href: "/admin/settings", label: "Settings", icon: Settings, check: canManageSettings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<Role>("super_admin");

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.user?.role) setRole(d.user.role);
      })
      .catch(() => {});
  }, []);

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#111111] flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="bg-brand text-white text-lg font-black rounded-lg w-8 h-8 flex items-center justify-center">
              K
            </span>
            <div>
              <span className="font-black text-sm text-white tracking-tight">KEFEL</span>
              <span className="text-brand font-black text-sm">.</span>
              <span className="font-black text-sm text-white tracking-tight">MEDIA</span>
              <span className="block text-[10px] text-gray-500 font-medium uppercase tracking-wider -mt-0.5">Newsroom</span>
            </div>
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-hide">
          {navSections.map((section) => (
            <div key={section.heading}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                {section.heading}
              </p>
              <div className="space-y-0.5">
                {section.items.filter((item) => !item.check || item.check(role)).map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand/20 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-brand" : ""} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-brand/20 text-brand text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>All systems operational</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
