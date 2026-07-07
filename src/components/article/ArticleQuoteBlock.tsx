interface ArticleQuoteBlockProps {
  text: string;
  author?: string;
}

export default function ArticleQuoteBlock({ text, author }: ArticleQuoteBlockProps) {
  return (
    <figure className="my-8 md:my-10 mx-0">
      <div className="relative bg-gray-50 dark:bg-zinc-800/40 rounded-xl border-l-[4px] border-brand p-5 md:p-7">
        <svg
          className="absolute top-4 left-4 w-8 h-8 md:w-10 md:h-10 text-brand/15 dark:text-brand/20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <blockquote className="text-lg md:text-xl lg:text-2xl font-medium text-zinc-200 italic leading-[1.7] md:leading-[1.8] pl-10 md:pl-12">
          {text}
        </blockquote>
        {author && (
          <figcaption className="mt-3 pl-10 md:pl-12 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            — {author}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
