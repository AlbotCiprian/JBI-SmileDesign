"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * ShimmerButton inspirat de Magic UI — luminita care se rotește pe border-ul butonului.
 * Folosit doar pe CTA-ul principal din Hero pentru efect premium subtil.
 * Fara CSS-in-JS extern; folosește gradienți Tailwind + animation custom în globals.css.
 */
type ShimmerButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ShimmerButton({ href, children, className }: ShimmerButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-jbi-blue px-7 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:text-base",
        className,
      )}
    >
      {/* Shimmer overlay */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
      />
      {/* Animated outer glow */}
      <span
        aria-hidden="true"
        className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-jbi-electric via-jbi-blue to-jbi-electric opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </Link>
  );
}
