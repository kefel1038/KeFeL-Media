import { sanitizeHtml } from "@/lib/sanitize";

interface ArticleBodyProps {
  content: string;
  secondaryImage?: string;
  secondaryImageCaption?: string;
}

function isHtml(text: string): boolean {
  return /<h[1-6]>|<blockquote>|<div|<figure>|<ul>|<ol>|<table>|<pre>|<p[\s>]/i.test(text);
}

function parseParagraphs(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // Already HTML with block elements — return as-is
  if (isHtml(trimmed)) return trimmed;

  // Plain text: split on double+ newlines into semantic paragraphs
  const blocks = trimmed
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) return "";

  return blocks
    .map((block) => {
      if (/^<[a-z]+[\s>]/i.test(block)) return block;
      return `<p>${block}</p>`;
    })
    .join("\n");
}

export default function ArticleBody({ content, secondaryImage, secondaryImageCaption }: ArticleBodyProps) {
  const html = parseParagraphs(content);

  const processed = html.replace(
    /<div class="highlight-box">([\s\S]*?)<\/div>/g,
    (_, inner) => `<div class="kfl-highlight-box">${inner}</div>`,
  );

  const safeHtml = sanitizeHtml(processed);

  return (
    <div className="article-content">
      <div
        className="
          prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-black prose-headings:font-headline
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:border-l-4 prose-h2:border-brand prose-h2:pl-4 prose-h2:leading-tight
          prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:leading-snug
          prose-p:leading-[1.7] prose-p:mb-6 prose-p:text-[17px] md:prose-p:text-[18px] prose-p:tracking-normal
          prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-a:font-medium
          prose-strong:font-bold
          prose-blockquote:border-l-brand prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-zinc-800/50 prose-blockquote:rounded-r-lg
          prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
          prose-li:my-1.5 prose-li:leading-relaxed
          prose-code:text-brand prose-code:bg-gray-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-hr:my-10
          first:prose-p:text-xl first:prose-p:font-medium first:prose-p:leading-relaxed
        "
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
      {secondaryImage && (
        <figure className="w-full md:w-80 float-right md:ml-6 md:mb-4 space-y-1 hidden md:block mt-6 md:mt-0">
          <div className="relative overflow-hidden rounded-lg aspect-video md:aspect-[4/3] w-full bg-gray-200 dark:bg-zinc-800 shadow-sm">
            <img
              src={secondaryImage}
              alt={secondaryImageCaption ?? "Article illustration"}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 ease-in-out"
            />
          </div>
          {secondaryImageCaption && (
            <p className="text-right text-gray-500 dark:text-gray-400 text-xs italic">{secondaryImageCaption}</p>
          )}
        </figure>
      )}
    </div>
  );
}
