"use client";

import { useState } from "react";
import {
  CheckCircle,
  Eye,
  Share2,
  BarChart3,
  Search,
  Filter,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

interface PublishedItem {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  views: number;
  shares: number;
  comments: number;
  status: "published" | "featured" | "trending";
  author: string;
  aiGenerated: boolean;
}

export default function PublishedPage() {
  const [items, setItems] = useState<PublishedItem[]>([
    {
      id: "1",
      title: "President Inaugurates New Hospital in Mbarara",
      category: "Health",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      views: 12500,
      shares: 890,
      comments: 45,
      status: "trending",
      author: "AI Newsroom",
      aiGenerated: true,
    },
    {
      id: "2",
      title: "Uganda Cranes Qualify for Africa Cup of Nations",
      category: "Sports",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      views: 28000,
      shares: 2100,
      comments: 156,
      status: "featured",
      author: "AI Newsroom",
      aiGenerated: true,
    },
    {
      id: "3",
      title: "New Mobile Money Regulations Announced",
      category: "Finance",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      views: 8200,
      shares: 450,
      comments: 23,
      status: "published",
      author: "AI Newsroom",
      aiGenerated: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "trending":
        return "bg-red-100 text-red-800";
      case "featured":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const filteredItems = items
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) => filter === "all" || item.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle size={24} className="text-green-500" />
            Published Stories
          </h1>
          <p className="text-sm text-gray-500">Track published content performance</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search published..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="trending">Trending</option>
          <option value="featured">Featured</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                  {item.aiGenerated && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      AI Generated
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{item.category}</span>
                  <span>{new Date(item.publishedAt).toLocaleString()}</span>
                  <span>By {item.author}</span>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye size={14} />
                    Views
                  </div>
                  <div className="font-semibold">{item.views.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Share2 size={14} />
                    Shares
                  </div>
                  <div className="font-semibold">{item.shares.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <BarChart3 size={14} />
                    Comments
                  </div>
                  <div className="font-semibold">{item.comments}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
