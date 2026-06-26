export default function ArticleLoading() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-3 w-48 bg-gray-200 dark:bg-zinc-800 rounded mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
        <article>
          {/* Category badge */}
          <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full mb-4" />

          {/* Title */}
          <div className="h-10 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg mb-3" />
          <div className="h-10 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4" />

          {/* Excerpt */}
          <div className="h-5 w-full bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded mb-8" />

          {/* Author bar */}
          <div className="flex items-center gap-3 py-4 mb-6 border-y border-gray-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800" />
            <div>
              <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded mb-1" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>

          {/* Featured image */}
          <div className="aspect-video md:aspect-[21/9] w-full bg-gray-200 dark:bg-zinc-800 rounded-xl mb-8" />

          {/* Body paragraphs */}
          <div className="space-y-4 max-w-[720px] mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className={i % 2 === 0 ? "h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" : ""} />
              </div>
            ))}
          </div>
        </article>

        {/* Sidebar skeleton */}
        <aside className="hidden lg:block space-y-6">
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="h-12 bg-gray-200 dark:bg-zinc-800" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4">
                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
