"use client";

import { useState } from "react";
import {
  Zap,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";

interface BreakingNews {
  id: string;
  headline: string;
  content: string;
  priority: "critical" | "high" | "medium";
  status: "draft" | "pending" | "sent";
  createdAt: string;
  sentAt?: string;
}

export default function BreakingNewsPage() {
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([
    {
      id: "1",
      headline: "Breaking: Major Road Accident on Kampala-Entebbe Highway",
      content: "A multi-vehicle accident has occurred on the Kampala-Entebbe highway near Kajjansi. Emergency services are on the scene.",
      priority: "critical",
      status: "sent",
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    },
  ]);

  const [newBreaking, setNewBreaking] = useState<{
    headline: string;
    content: string;
    priority: "critical" | "high" | "medium";
  }>({
    headline: "",
    content: "",
    priority: "high",
  });

  const handleCreateBreaking = async () => {
    if (!newBreaking.headline || !newBreaking.content) return;

    const breaking: BreakingNews = {
      id: Date.now().toString(),
      headline: newBreaking.headline,
      content: newBreaking.content,
      priority: newBreaking.priority,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    setBreakingNews([breaking, ...breakingNews]);
    setNewBreaking({ headline: "", content: "", priority: "high" });
  };

  const handleSendBreaking = async (id: string) => {
    setBreakingNews(
      breakingNews.map((item) =>
        item.id === id
          ? { ...item, status: "sent" as const, sentAt: new Date().toISOString() }
          : item
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle size={16} className="text-green-500" />;
      case "pending":
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Edit size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap size={24} className="text-red-500" />
            Breaking News
          </h1>
          <p className="text-sm text-gray-500">Create and manage breaking news alerts</p>
        </div>
      </div>

      <div className="bg-zinc-900 border-zinc-800 rounded-lg p-4">
        <h2 className="font-semibold mb-4">Create Breaking News</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input
              type="text"
              value={newBreaking.headline}
              onChange={(e) =>
                setNewBreaking({ ...newBreaking, headline: e.target.value })
              }
              placeholder="Breaking: Enter headline..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={newBreaking.content}
              onChange={(e) =>
                setNewBreaking({ ...newBreaking, content: e.target.value })
              }
              placeholder="Enter breaking news details..."
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={newBreaking.priority}
                onChange={(e) =>
                  setNewBreaking({
                    ...newBreaking,
                    priority: e.target.value as "critical" | "high" | "medium",
                  })
                }
                className="px-4 py-2 border rounded-lg"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
            <button
              onClick={handleCreateBreaking}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mt-6"
            >
              Create Alert
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Breaking News History</h2>
        {breakingNews.map((item) => (
          <div
            key={item.id}
            className={`bg-zinc-900 border-zinc-800 rounded-lg p-4 ${getPriorityColor(item.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(item.status)}
                  <span className="font-semibold">{item.headline}</span>
                </div>
                <p className="text-sm text-gray-600">{item.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Created: {new Date(item.createdAt).toLocaleString()}</span>
                  {item.sentAt && (
                    <span>Sent: {new Date(item.sentAt).toLocaleString()}</span>
                  )}
                </div>
              </div>
              {item.status !== "sent" && (
                <button
                  onClick={() => handleSendBreaking(item.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Send size={16} />
                  Send Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
