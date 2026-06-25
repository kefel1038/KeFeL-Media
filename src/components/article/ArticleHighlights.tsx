import { CheckCircle } from "lucide-react";

interface ArticleHighlightsProps {
  items: string[];
}

export default function ArticleHighlights({ items }: ArticleHighlightsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 mb-8">
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand mb-3 flex items-center gap-2">
        <CheckCircle size={14} />
        Key Points
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
            <span className="text-brand mt-0.5 flex-shrink-0">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
