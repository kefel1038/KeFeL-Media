"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  FileText,
} from "lucide-react";

interface CalendarArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  scheduled_at?: string;
  published_at?: string;
}

interface ContentCalendarProps {
  articles: CalendarArticle[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-500/20 text-green-400 border-green-500/30",
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export default function ContentCalendar({ articles }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const articlesByDate = useMemo(() => {
    const map: Record<string, CalendarArticle[]> = {};
    for (const article of articles) {
      const dateStr = (article.scheduled_at || article.published_at || "").slice(0, 10);
      if (dateStr) {
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(article);
      }
    }
    return map;
  }, [articles]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-brand" />
          <h3 className="text-sm font-bold text-white">Content Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-white min-w-[140px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-zinc-800">
        {DAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 border-b border-r border-zinc-800/50 bg-zinc-900/50" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayArticles = articlesByDate[dateStr] || [];
          const isToday = dateStr === today;

          return (
            <div
              key={day}
              className={`h-24 border-b border-r border-zinc-800/50 p-1.5 ${
                isToday ? "bg-brand/5" : ""
              }`}
            >
              <span
                className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                  isToday
                    ? "bg-brand text-white"
                    : "text-gray-400"
                }`}
              >
                {day}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayArticles.slice(0, 2).map((a) => (
                  <Link
                    key={a.id}
                    href={`/admin/articles/${a.id}/edit`}
                    className="block"
                  >
                    <div
                      className={`text-[10px] leading-tight px-1.5 py-0.5 rounded border truncate ${
                        STATUS_COLORS[a.status] || STATUS_COLORS.draft
                      }`}
                    >
                      {a.title}
                    </div>
                  </Link>
                ))}
                {dayArticles.length > 2 && (
                  <span className="text-[10px] text-gray-500 px-1">
                    +{dayArticles.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-zinc-800">
        {Object.entries(STATUS_COLORS).map(([status, cls]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full border ${cls}`} />
            <span className="text-[10px] text-gray-500 capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
