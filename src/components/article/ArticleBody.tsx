interface ArticleBodyProps {
  content: string;
  secondaryImage?: string;
  secondaryImageCaption?: string;
}

export default function ArticleBody({ content, secondaryImage, secondaryImageCaption }: ArticleBodyProps) {
  // Transform highlight-box divs into styled components
  const processed = content.replace(
    /<div class="highlight-box">([\s\S]*?)<\/div>/g,
    (_, inner) => `<div class="kfl-highlight-box">${inner}</div>`,
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="
          prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-headline
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-brand prose-h2:pl-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-800 dark:prose-h3:text-gray-200
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-5 prose-p:text-[17px] md:prose-p:text-lg
          prose-a:text-brand prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
          prose-blockquote:border-l-brand prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-zinc-800/50 prose-blockquote:rounded-r-lg
          prose-img:rounded-xl prose-img:shadow-md
          prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
          prose-code:text-brand prose-code:bg-gray-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          first:prose-p:text-xl first:prose-p:text-gray-800 dark:first:prose-p:text-gray-200 first:prose-p:font-medium first:prose-p:leading-relaxed
        "
        dangerouslySetInnerHTML={{ __html: processed }}
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
