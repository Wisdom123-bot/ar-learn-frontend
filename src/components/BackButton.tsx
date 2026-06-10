"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
}

/**
 * Reusable BackButton component with premium styling.
 * Used across the platform for consistent navigation.
 */
export default function BackButton({ className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`p-3 bg-white text-gray-400 rounded-2xl shadow-sm hover:text-blue-600 border border-transparent hover:border-blue-100 transition flex items-center justify-center ${className}`}
      title="Go Back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
    </button>
  );
}
