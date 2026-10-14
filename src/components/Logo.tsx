import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <img src="/logo.png" alt="Magnetiq — Moments That Stick" className="h-12 w-12" />
    </Link>
  );
}
