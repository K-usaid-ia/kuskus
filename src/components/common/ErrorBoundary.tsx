"use client";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We apologize for the inconvenience. Please try again.
          </p>
          {reset && (
            <button
              onClick={reset}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
