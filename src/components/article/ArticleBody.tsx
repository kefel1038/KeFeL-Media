interface ArticleBodyProps { content: string; }

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div
      className="
        prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-headline
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-brand prose-h2:pl-3
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
        prose-a:text-brand prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-blockquote:border-l-brand prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
        prose-img:rounded-xl
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
