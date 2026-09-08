"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen items-center justify-center text-center px-4 py-16">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl md:text-3xl font-semibold mb-3">
          <span className="bg-gradient-to-r from-red-700 to-red-400 bg-clip-text text-transparent">
            Something went wrong
          </span>
        </h1>
        <p className="text-gray-500 mb-6 max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="bg-cabgen-200 hover:bg-cabgen-100 rounded-lg py-2 px-6 text-lg text-white transition-colors"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
