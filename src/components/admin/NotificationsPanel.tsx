"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  FileText,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface Notification {
  id: string;
  type: "article" | "comment" | "trending" | "system";
  title: string;
  description?: string;
  href?: string;
  read: boolean;
  created_at: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  article: FileText,
  comment: MessageSquare,
  trending: TrendingUp,
  system: AlertTriangle,
};

const COLOR_MAP: Record<string, string> = {
  article: "bg-blue-500/20 text-blue-400",
  comment: "bg-purple-500/20 text-purple-400",
  trending: "bg-amber-500/20 text-amber-400",
  system: "bg-red-500/20 text-red-400",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const display = expanded ? notifications : notifications.slice(0, 5);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-brand" />
          <h3 className="text-sm font-bold text-white">Activity</h3>
          {unread > 0 && (
            <span className="text-[10px] font-bold bg-brand text-white px-1.5 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </div>
      </div>

      {display.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <Bell size={24} className="text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800">
          {display.map((notif) => {
            const Icon = ICON_MAP[notif.type] || Bell;
            const color = COLOR_MAP[notif.type] || "bg-zinc-500/20 text-zinc-400";

            const content = (
              <div
                key={notif.id}
                className={`flex items-start gap-3 px-5 py-3 hover:bg-zinc-800/50 transition-colors ${
                  !notif.read ? "bg-zinc-800/20" : ""
                }`}
              >
                <div className={`flex-shrink-0 p-1.5 rounded-lg ${color}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-snug">
                    {notif.title}
                  </p>
                  {notif.description && (
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {notif.description}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-gray-600 whitespace-nowrap flex items-center gap-1">
                  <Clock size={9} />
                  {timeAgo(notif.created_at)}
                </span>
              </div>
            );

            return notif.href ? (
              <Link key={notif.id} href={notif.href}>
                {content}
              </Link>
            ) : (
              content
            );
          })}
        </div>
      )}

      {notifications.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-2.5 text-xs text-brand hover:bg-zinc-800/50 transition-colors border-t border-zinc-800"
        >
          {expanded ? "Show less" : `Show all (${notifications.length})`}
        </button>
      )}
    </div>
  );
}
