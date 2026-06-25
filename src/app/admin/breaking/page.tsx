"use client";

import { useState } from "react";
import { Zap, Play, Square, Clock } from "lucide-react";

export default function BreakingNewsPage() {
  const [headline, setHeadline] = useState("");
  const [active, setActive] = useState(false);
  const [urgency, setUrgency] = useState("high");
  const [expiry, setExpiry] = useState("60");

  const handleActivate = () => {
    if (!headline.trim()) return;
    localStorage.setItem("kfl_breaking_headline", headline);
    localStorage.setItem("kfl_breaking_active", "true");
    localStorage.setItem("kfl_breaking_urgency", urgency);
    localStorage.setItem("kfl_breaking_expiry", expiry);
    setActive(true);
  };

  const handleDeactivate = () => {
    localStorage.setItem("kfl_breaking_active", "false");
    setActive(false);
    setHeadline("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Breaking News</h1>
          <p className="text-sm text-gray-500 mt-0.5">Control the breaking news ticker on the homepage</p>
        </div>
        <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg ${
          active ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          {active ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Zap size={16} className="text-brand" />
              Breaking News Headline
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Headline</label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                rows={3}
                placeholder="Enter breaking news headline..."
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleActivate}
                disabled={!headline.trim()}
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                <Play size={14} />
                Activate Breaking News
              </button>
              <button
                onClick={handleDeactivate}
                disabled={!active}
                className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30"
              >
                <Square size={14} />
                Deactivate
              </button>
            </div>
          </div>

          {active && (
            <div className="bg-gradient-to-r from-brand/10 to-transparent rounded-xl border border-brand/20 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Live Preview</p>
              <div className="bg-[#0a0a0a] rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="flex-shrink-0 bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Breaking</span>
                <p className="text-gray-200 text-sm font-medium truncate">{headline}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Settings</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Urgency Level</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Auto-expire after</label>
              <div className="flex items-center gap-2">
                <input type="number" value={expiry} onChange={(e) => setExpiry(e.target.value)} min={5}
                  className="w-20 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand" />
                <span className="text-xs text-gray-500">minutes</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Recent Breaking</h3>
            <div className="space-y-3">
              {[
                { text: "Uganda launches new economic development program", time: "2h ago" },
                { text: "Africa Cup of Nations 2026 kicks off", time: "1d ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0">
                  <Zap size={12} className="text-brand mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{item.text}</p>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5"><Clock size={9} />{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
