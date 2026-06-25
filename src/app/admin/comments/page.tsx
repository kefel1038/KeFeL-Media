"use client";

import { useState } from "react";
import { MessageSquare, Check, X, Clock, ThumbsUp, Flag } from "lucide-react";

const initialComments = [
  { id: 1, author: "John Doe", article: "Uganda's Economy Shows Growth", text: "Great analysis! The numbers are very promising.", status: "approved", date: "2h ago", likes: 12 },
  { id: 2, author: "Jane Smith", article: "Technology Sector Booms", text: "Interesting perspective. Would love to see more data.", status: "pending", date: "5h ago", likes: 3 },
  { id: 3, author: "Mike Johnson", article: "Education Reform Debate", text: "This is misleading and lacks evidence.", status: "flagged", date: "1d ago", likes: 0 },
  { id: 4, author: "Alice Brown", article: "Sports Update: Ugandan Athletes", text: "Proud of our athletes! 🇺🇬", status: "approved", date: "2d ago", likes: 24 },
  { id: 5, author: "Bob Wilson", article: "Health Care Improvements", text: "Not accurate according to WHO reports.", status: "flagged", date: "3d ago", likes: 1 },
];

export default function CommentsPage() {
  const [comments, setComments] = useState(initialComments);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? comments : comments.filter((c) => c.status === filter);

  const updateStatus = (id: number, status: string) => {
    setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const stats = [
    { label: "Total", count: comments.length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Approved", count: comments.filter((c) => c.status === "approved").length, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Pending", count: comments.filter((c) => c.status === "pending").length, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Flagged", count: comments.filter((c) => c.status === "flagged").length, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Comments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage reader discussions</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "approved", "pending", "flagged"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filter === f ? "bg-brand text-white" : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800"
            }`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <MessageSquare size={12} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.author}</p>
                  <p className="text-xs text-gray-400">on <span className="text-brand">{c.article}</span> · {c.date}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize ${
                c.status === "approved" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                c.status === "pending" ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" :
                "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              }`}>{c.status}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{c.text}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><ThumbsUp size={12} />{c.likes}</span>
              {c.status !== "approved" && (
                <button onClick={() => updateStatus(c.id, "approved")}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700"><Check size={12} />Approve</button>
              )}
              {c.status !== "flagged" && (
                <button onClick={() => updateStatus(c.id, "flagged")}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"><Flag size={12} />Flag</button>
              )}
              <button className="flex items-center gap-1 text-red-600 hover:text-red-700 ml-auto"><X size={12} />Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
