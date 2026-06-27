"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="text-center max-w-md">
            <div className="text-6xl font-black text-brand mb-4">500</div>
            <h1 className="text-2xl font-black text-gray-900 mb-3">
              KeFeL Media Error
            </h1>
            <p className="text-gray-500 mb-2">
              {error.digest
                ? `Error code: ${error.digest}`
                : "An unexpected error occurred."}
            </p>
            <p className="text-xs text-gray-400 mb-8">
              {error.message}
            </p>
            <button
              onClick={() => reset()}
              className="bg-brand text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-dark transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
