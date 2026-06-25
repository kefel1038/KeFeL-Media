"use client";

import { useState } from "react";
import { Settings, Save, Palette, Globe, Shield, Bell, Mail } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "KeFeL Media",
    tagline: "Your Trusted Source for News",
    language: "en",
    timezone: "Africa/Kampala",
    postsPerPage: "12",
    enableComments: true,
    autoApproveComments: false,
    emailNotifications: true,
  });

  const update = (key: string, value: any) => setSettings({ ...settings, [key]: value });

  const sections = [
    {
      title: "General",
      icon: Globe,
      fields: [
        { label: "Site Name", key: "siteName", type: "text" },
        { label: "Tagline", key: "tagline", type: "text" },
        { label: "Language", key: "language", type: "select", options: [{ value: "en", label: "English" }, { value: "sw", label: "Swahili" }, { value: "lg", label: "Luganda" }] },
        { label: "Timezone", key: "timezone", type: "select", options: [{ value: "Africa/Kampala", label: "Africa/Kampala (UTC+3)" }, { value: "Africa/Nairobi", label: "Africa/Nairobi (UTC+3)" }, { value: "UTC", label: "UTC" }] },
        { label: "Posts Per Page", key: "postsPerPage", type: "text" },
      ],
    },
    {
      title: "Moderation",
      icon: Shield,
      fields: [
        { label: "Enable Comments", key: "enableComments", type: "toggle" },
        { label: "Auto-Approve Comments", key: "autoApproveComments", type: "toggle" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      fields: [
        { label: "Email Notifications", key: "emailNotifications", type: "toggle" },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure your news platform</p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <section.icon size={16} className="text-brand" />
              {section.title}
            </h3>
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{field.label}</label>
                {field.type === "text" && (
                  <input type="text" value={settings[field.key as keyof typeof settings] as string}
                    onChange={(e) => update(field.key, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
                )}
                {field.type === "select" && (
                  <select value={settings[field.key as keyof typeof settings] as string} onChange={(e) => update(field.key, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                    {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                )}
                {field.type === "toggle" && (
                  <button onClick={() => update(field.key, !settings[field.key as keyof typeof settings])}
                    className={`relative w-10 h-5 rounded-full transition-colors ${settings[field.key as keyof typeof settings] ? "bg-brand" : "bg-gray-300 dark:bg-zinc-700"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[field.key as keyof typeof settings] ? "translate-x-5" : ""}`} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
