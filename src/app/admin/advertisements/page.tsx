"use client";

import { useState } from "react";
import { DollarSign, Plus, Eye, TrendingUp, Calendar, Play, Square } from "lucide-react";

const adSlots = [
  { id: 1, name: "Homepage Banner", size: "728×90", type: "image", status: "active", impressions: "45.2K", revenue: "$342", zone: "top" },
  { id: 2, name: "Article Sidebar", size: "300×250", type: "image", status: "active", impressions: "32.1K", revenue: "$218", zone: "sidebar" },
  { id: 3, name: "In-Article Ad", size: "468×60", type: "text", status: "inactive", impressions: "0", revenue: "$0", zone: "in-article" },
  { id: 4, name: "Mobile Banner", size: "320×100", type: "image", status: "active", impressions: "28.7K", revenue: "$195", zone: "mobile" },
  { id: 5, name: "Footer Ad", size: "728×90", type: "image", status: "inactive", impressions: "0", revenue: "$0", zone: "footer" },
];

export default function AdvertisementsPage() {
  const [ads, setAds] = useState(adSlots);

  const toggleStatus = (id: number) => {
    setAds(ads.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Advertisements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage ad slots and revenue</p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={16} />
          New Ad Slot
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active Slots", value: ads.filter((a) => a.status === "active").length, icon: Play, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Total Impressions", value: "106K", icon: Eye, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Total Revenue", value: "$755", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "CTR", value: "2.4%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <s.icon size={18} className={s.color} />
            <p className={`text-xl font-black ${s.color} mt-1`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800">
              {["Slot Name", "Size", "Zone", "Impressions", "Revenue", "Status", ""].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="border-b border-gray-100 dark:border-zinc-800 last:border-0">
                <td className="px-5 py-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{ad.name}</p>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{ad.size}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 capitalize">{ad.zone}</span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{ad.impressions}</td>
                <td className="px-5 py-3 text-sm font-semibold text-green-600">{ad.revenue}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleStatus(ad.id)}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 ${
                      ad.status === "active" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"
                    }`}>
                    {ad.status === "active" ? <Play size={10} /> : <Square size={10} />}
                    {ad.status}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button className="text-xs text-gray-400 hover:text-brand transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
