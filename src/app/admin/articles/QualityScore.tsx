"use client";

import { FileText, AlignLeft, Hash, Search } from "lucide-react";

interface QualityScoreProps {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
}

interface Score {
  label: string;
  icon: React.ElementType;
  value: string;
  pct: number;
  color: string;
}

export default function QualityScore({ title, excerpt, content, tags }: QualityScoreProps) {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const sentenceCount = content.replace(/<[^>]*>/g, "").split(/[.!?]+/).filter(Boolean).length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const hasSubheadings = /<h[23]/.test(content);
  const hasQuotes = /<blockquote/.test(content);
  const tagCount = tags.split(",").filter(Boolean).length;

  const hasCapitalizedStart = /^[A-Z]/.test(content.replace(/<[^>]*>/g, "").trim());
  const hasProperEnding = /[.!?]\s*$/.test(content.replace(/<[^>]*>/g, "").trim());
  const quotePairs = (content.match(/["""]/g) || []).length;
  const hasBalancedQuotes = quotePairs % 2 === 0;
  const grammarScore = hasCapitalizedStart && hasProperEnding && hasBalancedQuotes ? 92 : 75;

  const scores: Score[] = [
    {
      label: "Grammar",
      icon: FileText,
      value: `${grammarScore}%`,
      pct: grammarScore,
      color: grammarScore >= 85 ? "bg-green-500" : "bg-yellow-500",
    },
    {
      label: "Readability",
      icon: AlignLeft,
      value: avgWordsPerSentence <= 20 ? "Good" : "Needs work",
      pct: avgWordsPerSentence <= 15 ? 92 : avgWordsPerSentence <= 20 ? 80 : 60,
      color: avgWordsPerSentence <= 15 ? "bg-green-500" : avgWordsPerSentence <= 20 ? "bg-yellow-500" : "bg-red-500",
    },
    {
      label: "SEO",
      icon: Search,
      value: `${title.length}/60 chars`,
      pct: title.length >= 30 && title.length <= 70 && tagCount >= 2 && wordCount >= 300 ? 88 : 55,
      color: title.length >= 30 && title.length <= 70 ? "bg-green-500" : "bg-yellow-500",
    },
    {
      label: "Engagement",
      icon: Hash,
      value: hasSubheadings ? "Structured" : "Plain text",
      pct: hasSubheadings && hasQuotes ? 92 : hasSubheadings ? 78 : 50,
      color: hasSubheadings && hasQuotes ? "bg-green-500" : hasSubheadings ? "bg-blue-500" : "bg-yellow-500",
    },
  ];

  const avg = Math.round(scores.reduce((s, sc) => s + sc.pct, 0) / scores.length);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Content Quality</h3>

      <div className="flex items-center justify-center">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" className="dark:stroke-zinc-700" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#D32F2F" strokeWidth="3" strokeDasharray={`${avg * 0.97} 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-gray-900 dark:text-white">{avg}%</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {scores.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Icon size={12} />
                  {s.label}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{s.value}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-gray-400 space-y-0.5 pt-1 border-t border-gray-100 dark:border-zinc-800">
        <p>{wordCount} words · {sentenceCount} sentences · {avgWordsPerSentence.toFixed(1)} avg words/sentence</p>
        <p>{hasSubheadings ? "✓ Subheadings detected" : "✗ No subheadings — add section breaks"} · {hasQuotes ? "✓ Quotes included" : "✗ No quotes"}</p>
      </div>
    </div>
  );
}
