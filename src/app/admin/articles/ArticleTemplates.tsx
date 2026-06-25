"use client";

import { BookOpen, Zap, Users, Briefcase, Film, Search } from "lucide-react";

interface ArticleTemplatesProps {
  onSelect: (template: { title: string; excerpt: string; content: string; category: string; tags: string }, id?: string) => void;
}

const templates = [
  {
    id: "breaking",
    label: "Breaking News",
    icon: Zap,
    desc: "Urgent, fast-paced coverage",
    color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    content: {
      title: "",
      excerpt: "Breaking: [Headline]\n\n[Location] — [Lead paragraph answering who, what, when, where, why]",
      content: `<p><strong>[LOCATION]</strong> — [Lead paragraph — who, what, when, where, why — 2-3 sentences max]</p>
<p>[Context — what happened leading up to this? 2-3 sentences]</p>
<p>[Impact — what does this mean for people involved? 2-3 sentences]</p>
<p>[Official response — quotes from authorities or witnesses, if available]</p>
<p>[Next steps — what happens now? 1-2 sentences]</p>`,
      category: "uganda",
      tags: "breaking, urgent",
    },
  },
  {
    id: "sports",
    label: "Sports",
    icon: Users,
    desc: "Match coverage & analysis",
    color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    content: {
      title: "",
      excerpt: "[Team/Player] [achieves/wins/loses] in [competition]",
      content: `<p><strong>[VENUE, Location]</strong> — [Opening — the result, the score, the key moment]</p>
<p>[How the match/game unfolded — chronological or thematic]</p>
<p>[Key players/performances — who stood out?]</p>
<p>[Turning point — the moment that decided the outcome]</p>
<p>[Quotes from players/coaches]</p>
<p>[What this means going forward]</p>`,
      category: "sports",
      tags: "sports",
    },
  },
  {
    id: "politics",
    label: "Politics",
    icon: BookOpen,
    desc: "Policy & political analysis",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    content: {
      title: "",
      excerpt: "[Leader/Government] [announces/proposes/changes] [policy/decision]",
      content: `<p><strong>[LOCATION]</strong> — [Opening — what was announced/decided and by whom]</p>
<p>[Details of the policy/decision — what exactly is changing?]</p>
<p>[Background — what led to this decision?]</p>
<p>[Reactions — support and criticism from various sides]</p>
<p>[Analysis — what this means for citizens/the region]</p>`,
      category: "politics",
      tags: "politics, policy",
    },
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    desc: "Markets, economy & finance",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    content: {
      title: "",
      excerpt: "[Company/Sector] [reports/launches/announces] [news] affecting [industry/market]",
      content: `<p><strong>[LOCATION]</strong> — [Opening — the key business/financial news]</p>
<p>[Key numbers — revenue, growth, market impact]</p>
<p>[Context — why this matters for the industry/economy]</p>
<p>[Executive quotes — CEO, analysts]</p>
<p>[Outlook — what's expected next]</p>`,
      category: "business",
      tags: "business, economy",
    },
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: Film,
    desc: "Culture, arts & lifestyle",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    content: {
      title: "",
      excerpt: "[Artist/Event/Film] [makes/breaks/announces] [news] in [industry/genre]",
      content: `<p><strong>[LOCATION]</strong> — [Opening — what's happening in entertainment/culture]</p>
<p>[Details — who, what, when, where]</p>
<p>[Why it matters — cultural significance]</p>
<p>[Quotes from artists/organizers]</p>
<p>[What audiences can expect]</p>`,
      category: "entertainment",
      tags: "entertainment, culture",
    },
  },
  {
    id: "investigative",
    label: "Investigative",
    icon: Search,
    desc: "In-depth reporting & analysis",
    color: "bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800",
    content: {
      title: "",
      excerpt: "Investigation reveals [finding] about [subject] affecting [community/sector]",
      content: `<p><strong>[LOCATION]</strong> — [Opening — the key finding of the investigation]</p>
<p>[Methodology — how the investigation was conducted]</p>
<p>[Evidence — what was discovered, with specific examples]</p>
<p>[Key players — who is involved/who is affected]</p>
<p>[Responses — official reactions]</p>
<p>[Broader implications — why this matters]</p>`,
      category: "uganda",
      tags: "investigative, exclusive",
    },
  },
];

export default function ArticleTemplates({ onSelect }: ArticleTemplatesProps) {
  return (
    <div>
      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Article Templates</h3>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.content, t.id)}
              className={`flex flex-col items-start gap-1.5 p-3 rounded-lg border text-left transition-all hover:scale-[1.02] ${t.color}`}
            >
              <Icon size={14} />
              <span className="text-xs font-bold">{t.label}</span>
              <span className="text-[10px] opacity-70 leading-tight">{t.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
