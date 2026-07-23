"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  Play,
  Pause,
  Search,
  Plus,
} from "lucide-react";

interface ScheduledItem {
  id: string;
  title: string;
  category: string;
  scheduledAt: string;
  status: "scheduled" | "paused" | "published";
  createdAt: string;
  author: string;
}

export default function ScheduledPage() {
  const [items, setItems] = useState<ScheduledItem[]>([
    {
      id: "1",
      title: "Morning Briefing: Today's Top Stories",
      category: "News Digest",
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      status: "scheduled",
      createdAt: new Date().toISOString(),
      author: "AI Newsroom",
    },
    {
      id: "2",
      title: "Weekly Tech Roundup",
      category: "Technology",
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      status: "scheduled",
      createdAt: new Date().toISOString(),
      author: "AI Newsroom",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handlePause = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "paused" ? "scheduled" : "paused",
            }
          : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handlePublishNow = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, status: "published" } : item
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "published":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar size={24} className="text-indigo-500" />
            Scheduled Stories
          </h1>
          <p className="text-sm text-gray-500">Manage scheduled content publication</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark">
          <Plus size={16} />
          Schedule New
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search scheduled..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-zinc-900 border-zinc-800 rounded-lg p-4">
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
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{item.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(item.scheduledAt).toLocaleString()}
                  </span>
                  <span>By {item.author}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePublishNow(item.id)}
                  className="p-2 text-gray-400 hover:text-green-500"
                  title="Publish Now"
                >
                  <Play size={16} />
                </button>
                <button
                  onClick={() => handlePause(item.id)}
                  className="p-2 text-gray-400 hover:text-yellow-500"
                  title={item.status === "paused" ? "Resume" : "Pause"}
                >
                  <Pause size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-500">
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
