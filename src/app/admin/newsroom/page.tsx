"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp, AlertTriangle, FileText, Clock, Send,
  BarChart3, Bot, Zap, ArrowRight, RefreshCw
} from "lucide-react";

const stats = [
  { label: "Trending Topics", value: 12, icon: TrendingUp, color: "text-brand-primary", change: "+3" },
  { label: "Pending Verification", value: 5, icon: AlertTriangle, color: "text-yellow-500", change: "+2" },
  { label: "AI Drafts", value: 8, icon: FileText, color: "text-blue-500", change: "+4" },
  { label: "Scheduled", value: 15, icon: Clock, color: "text-purple-500", change: "+5" },
  { label: "Published Today", value: 24, icon: Send, color: "text-green-500", change: "+8" },
  { label: "AI Tokens Used", value: "45.2K", icon: Zap, color: "text-orange-500", change: "+12K" },
];

const recentActivity = [
  { time: "2 min ago", agent: "News Scout", action: "Detected 3 new trending topics", status: "success" },
  { time: "5 min ago", agent: "Fact Checker", action: "Verified 2 claims in article #1234", status: "success" },
  { time: "8 min ago", agent: "Article Writer", action: "Generated draft: 'Uganda's Digital Economy'", status: "success" },
  { time: "12 min ago", agent: "SEO Agent", action: "Optimized metadata for 3 articles", status: "success" },
  { time: "15 min ago", agent: "Social Agent", action: "Queued 5 posts for publishing", status: "success" },
  { time: "20 min ago", agent: "Dedup Agent", action: "Merged 2 duplicate stories", status: "warning" },
  { time: "25 min ago", agent: "Image Agent", action: "Generated featured image for article", status: "success" },
  { time: "30 min ago", agent: "Translator", action: "Translated 2 articles to Swahili", status: "success" },
];

const topTrends = [
  { title: "Uganda's New Digital Infrastructure Bill", viralScore: 87, region: "Uganda", category: "Politics" },
  { title: "East African Community Trade Agreement", viralScore: 82, region: "East Africa", category: "Business" },
  { title: "AI Regulation Framework for Africa", viralScore: 79, region: "Africa", category: "Technology" },
  { title: "Nile Basin Water Sharing Update", viralScore: 75, region: "East Africa", category: "World" },
  { title: "African Startup Funding Q2 2026", viralScore: 71, region: "Africa", category: "Business" },
];

const aiAgents = [
  { name: "News Scout", status: "active", lastRun: "2 min ago", successRate: 98 },
  { name: "Dedup Agent", status: "active", lastRun: "5 min ago", successRate: 95 },
  { name: "Fact Checker", status: "active", lastRun: "8 min ago", successRate: 92 },
  { name: "Article Writer", status: "active", lastRun: "12 min ago", successRate: 97 },
  { name: "SEO Agent", status: "active", lastRun: "15 min ago", successRate: 99 },
  { name: "Image Agent", status: "idle", lastRun: "1 hour ago", successRate: 94 },
  { name: "Translator", status: "active", lastRun: "30 min ago", successRate: 96 },
  { name: "Social Agent", status: "active", lastRun: "20 min ago", successRate: 98 },
];

export default function NewsroomDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Newsroom Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Real-time monitoring and AI pipeline status</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/admin/newsroom/trends"
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <TrendingUp size={14} />
            View Trends
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={18} className={stat.color} />
                <span className="text-green-500 text-xs font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <Link href="/admin/newsroom/agents" className="text-brand-primary text-xs font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {recentActivity.map((activity, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">
                    <span className="font-semibold text-brand-primary">{activity.agent}</span>
                    {" — "}
                    {activity.action}
                  </p>
                </div>
                <span className="text-zinc-500 text-xs whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">AI Agents</h2>
            <Link href="/admin/newsroom/agents" className="text-brand-primary text-xs font-semibold hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {aiAgents.map((agent, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors">
                <Bot size={16} className="text-zinc-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{agent.name}</p>
                  <p className="text-zinc-500 text-xs">{agent.lastRun}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 'bg-zinc-600'
                  }`} />
                  <span className="text-zinc-400 text-xs">{agent.successRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Trends */}
      <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Top Trending Topics</h2>
          <Link href="/admin/newsroom/trends" className="text-brand-primary text-xs font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-zinc-800">
          {topTrends.map((trend, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors">
              <span className="text-zinc-600 font-bold text-lg w-8">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{trend.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-zinc-500 text-xs">{trend.region}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500 text-xs">{trend.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full"
                    style={{ width: `${trend.viralScore}%` }}
                  />
                </div>
                <span className="text-brand-primary font-bold text-sm">{trend.viralScore}</span>
              </div>
              <Link
                href={`/admin/newsroom/drafts/new?trend=${encodeURIComponent(trend.title)}`}
                className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-lg transition-colors"
              >
                Draft
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
