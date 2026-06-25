"use client";

import { useState } from "react";
import { Mail, Send, Users, Eye, TrendingUp } from "lucide-react";

const campaigns = [
  { id: 1, subject: "Weekly Digest: Top Stories This Week", sent: 452, opened: 234, clicked: 89, date: "2 days ago", status: "sent" },
  { id: 2, subject: "Breaking: Uganda's New Policy Changes", sent: 448, opened: 312, clicked: 145, date: "1 week ago", status: "sent" },
  { id: 3, subject: "Special Report: Technology in Africa", sent: 440, opened: 198, clicked: 67, date: "2 weeks ago", status: "sent" },
];

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Newsletter</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage email campaigns</p>
        </div>
        <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <Users size={14} />
          452 Subscribers
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Mail size={16} className="text-brand" />
            New Campaign
          </h3>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Subject Line</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8}
              placeholder="Write your newsletter content here..."
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-brand" />
          </div>
          <button disabled={!subject.trim() || !content.trim()}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
            <Send size={14} />
            Send to Subscribers
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Campaign Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Send, label: "Total Sent", value: "1,340", color: "text-blue-600" },
                { icon: Eye, label: "Open Rate", value: "56%", color: "text-green-600" },
                { icon: TrendingUp, label: "Click Rate", value: "22%", color: "text-purple-600" },
              ].map((s) => (
                <div key={s.label}>
                  <s.icon size={16} className={`${s.color} mb-1`} />
                  <p className="text-lg font-black text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Recent Campaigns</h3>
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.subject}</p>
                    <p className="text-xs text-gray-400">{c.date} · {c.sent} recipients</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 capitalize">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
