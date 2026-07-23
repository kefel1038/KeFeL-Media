"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";

interface AnalyticsData {
  totalArticles: number;
  totalViews: number;
  totalShares: number;
  averageReadTime: number;
  topCategories: { name: string; count: number; views: number }[];
  recentPerformance: { date: string; articles: number; views: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalArticles: 156,
    totalViews: 245000,
    totalShares: 12500,
    averageReadTime: 3.2,
    topCategories: [
      { name: "Politics", count: 45, views: 85000 },
      { name: "Technology", count: 32, views: 62000 },
      { name: "Sports", count: 28, views: 48000 },
      { name: "Business", count: 25, views: 32000 },
      { name: "Health", count: 26, views: 18000 },
    ],
    recentPerformance: [
      { date: "2026-07-17", articles: 12, views: 18500 },
      { date: "2026-07-18", articles: 15, views: 22000 },
      { date: "2026-07-19", articles: 18, views: 28000 },
      { date: "2026-07-20", articles: 14, views: 19500 },
      { date: "2026-07-21", articles: 16, views: 24000 },
      { date: "2026-07-22", articles: 20, views: 32000 },
      { date: "2026-07-23", articles: 22, views: 35000 },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("7d");

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={24} className="text-emerald-500" />
            Analytics
          </h1>
          <p className="text-sm text-gray-500">AI Newsroom performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Articles</p>
              <p className="text-2xl font-bold">{data.totalArticles}</p>
            </div>
            <BarChart3 size={24} className="text-blue-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">+12% from last period</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">{data.totalViews.toLocaleString()}</p>
            </div>
            <Eye size={24} className="text-purple-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">+24% from last period</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Shares</p>
              <p className="text-2xl font-bold">{data.totalShares.toLocaleString()}</p>
            </div>
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">+18% from last period</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Read Time</p>
              <p className="text-2xl font-bold">{data.averageReadTime} min</p>
            </div>
            <Clock size={24} className="text-orange-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">+0.3 min from last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Top Categories</h2>
          <div className="space-y-3">
            {data.topCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{cat.name}</span>
                  <span className="text-sm text-gray-500">
                    {cat.count} articles · {cat.views.toLocaleString()} views
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full"
                    style={{
                      width: `${(cat.views / data.topCategories[0].views) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Performance Trend</h2>
          <div className="space-y-2">
            {data.recentPerformance.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <span className="text-sm text-gray-500 w-20">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded"
                      style={{
                        width: `${(day.views / 35000) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-16 text-right">
                  {day.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
