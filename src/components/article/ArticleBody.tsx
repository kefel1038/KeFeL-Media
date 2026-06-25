interface ArticleBodyProps {
  content: string;
  secondaryImage?: string;
  secondaryImageCaption?: string;
}

export default function ArticleBody({ content, secondaryImage, secondaryImageCaption }: ArticleBodyProps) {
  return (
    <div className="max-w-2xl">
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
      {secondaryImage && (
        <figure className="w-full md:w-80 float-right md:ml-6 md:mb-4 space-y-1 hidden md:block mt-4 md:mt-0">
          <div className="relative overflow-hidden rounded-lg aspect-video md:aspect-[4/3] w-full bg-gray-200 dark:bg-zinc-800">
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
