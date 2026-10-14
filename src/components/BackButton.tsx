"use client";

import { useRouter } from "next/navigation";

export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-brand/10 hover:text-brand ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5 L8 12 L15 19" />
      </svg>
    </button>
  );
}
