import { CheckCircle } from "lucide-react";

interface ArticleHighlightsProps {
  items: string[];
}

export default function ArticleHighlights({ items }: ArticleHighlightsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-brand/[0.06] dark:bg-brand/[0.08] border border-brand/20 dark:border-brand/30 rounded-xl p-5 md:p-6 mb-8 md:mb-10">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand mb-3.5 flex items-center gap-2">
        <CheckCircle size={14} className="shrink-0" />
        Key Highlights
      </h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm md:text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <span className="text-brand mt-0.5 flex-shrink-0 font-bold">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
