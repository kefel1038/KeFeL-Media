"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-black text-brand mb-4">500</div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          {error.digest
            ? `Error code: ${error.digest}`
            : "An unexpected error occurred."}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">
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
  );
}
