"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Tag,
} from "lucide-react";

interface Trend {
  id: string;
  title: string;
  summary: string;
  viralScore: number;
  importance: number;
  urgency: number;
  region?: string;
  topic?: string;
  velocity: number;
  relatedItems: string[];
  createdAt: string;
}

export default function LiveTrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setLoading(true);
    // Simulate API call - in production this would fetch from database
    setTimeout(() => {
      setTrends([
        {
          id: "1",
          title: "Uganda Parliament Debates New Media Bill",
          summary: "Parliament is discussing a controversial media regulation bill that could affect digital news outlets.",
          viralScore: 0.85,
          importance: 0.9,
          urgency: 0.7,
          region: "Uganda",
          topic: "Politics",
          velocity: 2.3,
          relatedItems: ["Media freedom concerns", "Press association response"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "East African Community Trade Agreement Update",
          summary: "EAC member states are finalizing a new trade agreement that could boost regional commerce.",
          viralScore: 0.72,
          importance: 0.85,
          urgency: 0.6,
          region: "East Africa",
          topic: "Economy",
          velocity: 1.8,
          relatedItems: ["Trade statistics", "Business reactions"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Kampala Hosts African Tech Summit",
          summary: "Major tech companies are gathering in Kampala for the annual African Technology Summit.",
          viralScore: 0.68,
          importance: 0.75,
          urgency: 0.5,
          region: "Uganda",
          topic: "Technology",
          velocity: 1.5,
          relatedItems: ["Startup presentations", "Investment announcements"],
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const filteredTrends = trends.filter((trend) => {
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === "all" || trend.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Trends</h1>
          <p className="text-sm text-gray-500">Real-time trending topics and stories</p>
        </div>
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Regions</option>
          <option value="Uganda">Uganda</option>
          <option value="East Africa">East Africa</option>
          <option value="Africa">Africa</option>
          <option value="Global">Global</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTrends.map((trend) => (
            <div
              key={trend.id}
              className="bg-zinc-900 border-zinc-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-lg">{trend.title}</span>
                    <ArrowUpRight size={16} className="text-green-500" />
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{trend.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {trend.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {trend.topic}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(trend.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">Viral Score</div>
                    <div className="text-lg font-bold text-brand">{Math.round(trend.viralScore * 100)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">Velocity</div>
                    <div className="text-lg font-bold text-green-600">+{trend.velocity}x</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Related:</span>
                  {trend.relatedItems.map((item, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
