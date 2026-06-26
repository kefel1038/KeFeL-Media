"use client";

import { CheckCircle, XCircle, AlertTriangle, Search, FileText, Image, Link } from "lucide-react";

interface ArticleSEOProps {
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  tags: string;
  content: string;
}

interface SEOCheck {
  label: string;
  passed: boolean;
  icon: React.ElementType;
  tip: string;
}

export default function ArticleSEO({ title, excerpt, slug, image, tags, content }: ArticleSEOProps) {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;

  const checks: SEOCheck[] = [
    {
      label: `Headline optimized (${title.length}/60 chars)`,
      passed: title.length >= 30 && title.length <= 70,
      icon: FileText,
      tip: "Keep headlines between 30-60 characters for best SERP display",
    },
    {
      label: "Meta description added",
      passed: excerpt.length >= 50 && excerpt.length <= 160,
      icon: FileText,
      tip: "Write 50-160 character excerpt that includes keywords",
    },
    {
      label: "Slug is clean & keyword-rich",
      passed: slug.length >= 10 && slug.split("-").length >= 2 && !slug.includes("undefined"),
      icon: Link,
      tip: "Use 3-5 keyword-rich words separated by hyphens",
    },
    {
      label: "Cover image set",
      passed: image.length > 0,
      icon: Image,
      tip: "Every article needs a featured image",
    },
    {
      label: "Tags added",
      passed: tags.split(",").filter(Boolean).length >= 2,
      icon: Search,
      tip: "Add at least 2-3 relevant tags for better discovery",
    },
    {
      label: `Content length (${wordCount} words)`,
      passed: wordCount >= 300,
      icon: FileText,
      tip: "Aim for 500+ words for better SEO ranking",
    },
  ];

  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600";
  const scoreBg = score >= 80 ? "bg-green-50 dark:bg-green-900/20" : score >= 50 ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-red-50 dark:bg-red-900/20";

  const metaDesc = excerpt.slice(0, 160);
  const displayUrl = `kefelmedia.com/article/${slug}`;

  return (
    <div className="space-y-4">
      {/* SERP Preview */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 overflow-hidden">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Google SERP Preview</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-3 max-w-[600px]">
          <p className="text-[10px] text-gray-500 mb-1">{displayUrl}</p>
          <p className="text-sm text-blue-700 font-medium leading-tight hover:underline cursor-pointer line-clamp-2">
            {title || "Article Title"}
          </p>
          <p className="text-[11px] text-gray-600 leading-snug mt-0.5 line-clamp-2">
            {metaDesc || "Meta description will appear here..."}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Search size={14} className="text-brand" />
            SEO Score
          </h3>
          <span className={`text-lg font-black ${scoreColor} ${scoreBg} px-2.5 py-0.5 rounded-lg`}>{score}%</span>
        </div>

        <div className="space-y-2.5">
          {checks.map((check) => {
            const Icon = check.icon;
            return (
              <div key={check.label} className="group relative">
                <div className="flex items-start gap-2.5">
                  {check.passed ? (
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs font-medium ${check.passed ? "text-gray-600 dark:text-gray-400" : "text-gray-500 dark:text-gray-500"}`}>
                      {check.label}
                    </p>
                    {!check.passed && (
                      <p className="text-[10px] text-red-400 mt-0.5">{check.tip}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
