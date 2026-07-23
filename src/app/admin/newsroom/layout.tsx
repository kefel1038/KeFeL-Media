"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp, AlertTriangle, CheckCircle, FileText, Clock,
  Send, BarChart3, Bot, BookOpen, Radio, Users, Settings, LayoutGrid, Languages
} from "lucide-react";

const newsroomSections = [
  { label: "Overview", href: "/admin/newsroom", icon: BarChart3 },
  { label: "Editorial Workflow", href: "/admin/newsroom/workflow", icon: LayoutGrid },
  { label: "Live Trends", href: "/admin/newsroom/trends", icon: TrendingUp },
  { label: "Breaking News", href: "/admin/newsroom/breaking", icon: AlertTriangle },
  { label: "Pending Verification", href: "/admin/newsroom/pending", icon: CheckCircle },
  { label: "AI Drafts", href: "/admin/newsroom/drafts", icon: FileText },
  { label: "Editor Queue", href: "/admin/newsroom/queue", icon: Clock },
  { label: "Scheduled", href: "/admin/newsroom/scheduled", icon: Send },
  { label: "Published", href: "/admin/newsroom/published", icon: Radio },
  { label: "Translations", href: "/admin/newsroom/translations", icon: Languages },
  { label: "Social Queue", href: "/admin/newsroom/social", icon: Users },
  { label: "Analytics", href: "/admin/newsroom/analytics", icon: BarChart3 },
  { label: "AI Agents", href: "/admin/newsroom/agents", icon: Bot },
  { label: "Knowledge Base", href: "/admin/newsroom/knowledge", icon: BookOpen },
  { label: "Settings", href: "/admin/newsroom/settings", icon: Settings },
];

export default function NewsroomLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Newsroom Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">AI Newsroom</h1>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Command Center</p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-zinc-400 text-xs">All systems operational</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {newsroomSections.map((section) => {
            const Icon = section.icon;
            const isActive = pathname === section.href;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary border-r-2 border-brand-primary"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <Icon size={16} />
                <span>{section.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-zinc-800">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-zinc-800/50 rounded p-2">
              <p className="text-brand-primary font-bold text-lg">12</p>
              <p className="text-zinc-500 text-[10px]">Trending</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-2">
              <p className="text-yellow-500 font-bold text-lg">5</p>
              <p className="text-zinc-500 text-[10px]">Pending</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-2">
              <p className="text-blue-500 font-bold text-lg">8</p>
              <p className="text-zinc-500 text-[10px]">Drafts</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-2">
              <p className="text-green-500 font-bold text-lg">24</p>
              <p className="text-zinc-500 text-[10px]">Published</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
