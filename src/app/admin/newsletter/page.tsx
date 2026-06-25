"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Users, Eye, TrendingUp, Trash2, Plus, X } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribed_at: string;
  status: string;
  source: string;
}

interface Campaign {
  id: string;
  subject: string;
  content: string;
  sent_at: string;
  status: string;
  recipient_count: number;
  opened_count: number;
  clicked_count: number;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");

  const fetchData = async () => {
    try {
      const [subRes, camRes] = await Promise.all([
        fetch("/api/admin/newsletter/subscribers"),
        fetch("/api/admin/newsletter/campaigns"),
      ]);
      const subData = await subRes.json();
      const camData = await camRes.json();
      if (subData.success) setSubscribers(subData.subscribers);
      if (camData.success) setCampaigns(camData.campaigns);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns((prev) => [data.campaign, ...prev]);
        setSubject("");
        setContent("");
      }
    } catch {} finally {
      setSending(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail.trim()) return;
    try {
      const res = await fetch("/api/admin/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail, name: addName }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers((prev) => [data.subscriber, ...prev]);
        setAddEmail("");
        setAddName("");
      }
    } catch {}
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Delete this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch {}
  };

  const activeSubscribers = subscribers.filter((s) => s.status === "active");
  const totalSent = campaigns.reduce((sum, c) => sum + (c.recipient_count ?? 0), 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + (c.opened_count ?? 0), 0);
  const totalClicked = campaigns.reduce((sum, c) => sum + (c.clicked_count ?? 0), 0);
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Newsletter</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage email campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSubscribers(true)}
            className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <Users size={14} />
            {activeSubscribers.length} Subscribers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <form onSubmit={handleSend} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
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
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Content (HTML)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8}
              placeholder="Write your newsletter HTML content here..."
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand" />
          </div>
          <button type="submit" disabled={!subject.trim() || !content.trim() || sending}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
            <Send size={14} />
            {sending ? "Sending..." : `Send to ${activeSubscribers.length} Subscribers`}
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Campaign Stats</h3>
            {loading ? (
              <p className="text-xs text-gray-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Send, label: "Total Sent", value: totalSent.toLocaleString(), color: "text-blue-600" },
                  { icon: Eye, label: "Open Rate", value: `${openRate}%`, color: "text-green-600" },
                  { icon: TrendingUp, label: "Click Rate", value: `${clickRate}%`, color: "text-purple-600" },
                ].map((s) => (
                  <div key={s.label}>
                    <s.icon size={16} className={`${s.color} mb-1`} />
                    <p className="text-lg font-black text-gray-900 dark:text-white">{s.value}</p>
                    <p className="text-[10px] text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Recent Campaigns</h3>
            {loading ? (
              <p className="text-xs text-gray-400">Loading...</p>
            ) : campaigns.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No campaigns yet. Send your first newsletter!</p>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.subject}</p>
                      <p className="text-xs text-gray-400">
                        {c.sent_at ? new Date(c.sent_at).toLocaleDateString() : "Draft"} · {c.recipient_count} recipients
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize ${
                      c.status === "sent"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-500"
                    }`}>{c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSubscribers && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowSubscribers(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Subscribers ({activeSubscribers.length})</h3>
              <button onClick={() => setShowSubscribers(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubscriber} className="flex gap-2 p-4 border-b border-gray-200 dark:border-zinc-800">
              <input type="email" required value={addEmail} onChange={(e) => setAddEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)}
                placeholder="Name (optional)"
                className="w-32 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-brand" />
              <button type="submit" className="bg-brand hover:bg-brand-dark text-white p-2 rounded-lg"><Plus size={16} /></button>
            </form>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {subscribers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No subscribers yet.</p>
              ) : (
                subscribers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.email}</p>
                      <p className="text-xs text-gray-400">{s.name || "—"} · {new Date(s.subscribed_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        s.status === "active"
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-500"
                      }`}>{s.status}</span>
                      <button onClick={() => handleDeleteSubscriber(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
