"use client";

import { useState } from "react";
import {
  ListTodo,
  Clock,
  CheckCircle,
  XCircle,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";

interface QueueItem {
  id: string;
  title: string;
  type: "article" | "social" | "newsletter" | "notification";
  priority: number;
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: string;
  estimatedTime?: string;
}

export default function EditorQueuePage() {
  const [items, setItems] = useState<QueueItem[]>([
    {
      id: "1",
      title: "Parliament Debates New Education Policy",
      type: "article",
      priority: 1,
      status: "queued",
      createdAt: new Date().toISOString(),
      estimatedTime: "2 min",
    },
    {
      id: "2",
      title: "Social: Tech Summit Announcement",
      type: "social",
      priority: 2,
      status: "processing",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Newsletter: Weekly Digest",
      type: "newsletter",
      priority: 3,
      status: "queued",
      createdAt: new Date().toISOString(),
      estimatedTime: "5 min",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const handleMoveUp = (id: string) => {
    const index = items.findIndex((item) => item.id === id);
    if (index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      setItems(newItems);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = items.findIndex((item) => item.id === id);
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setItems(newItems);
    }
  };

  const handleCancel = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "processing":
        return <Clock size={16} className="text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <ListTodo size={16} className="text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-100 text-blue-800";
      case "social":
        return "bg-purple-100 text-purple-800";
      case "newsletter":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListTodo size={24} className="text-purple-500" />
            Editor Queue
          </h1>
          <p className="text-sm text-gray-500">Manage content processing queue</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search queue..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="article">Articles</option>
          <option value="social">Social Posts</option>
          <option value="newsletter">Newsletters</option>
          <option value="notification">Notifications</option>
        </select>
      </div>

      <div className="bg-zinc-900 border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Position
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Est. Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <GripVertical size={14} className="text-gray-400" />
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{item.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                      item.type
                    )}`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm">{item.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {item.estimatedTime || "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveUp(item.id)}
                      className="p-1 text-gray-400 hover:text-blue-500"
                      disabled={index === 0}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(item.id)}
                      className="p-1 text-gray-400 hover:text-blue-500"
                      disabled={index === filteredItems.length - 1}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => handleCancel(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
