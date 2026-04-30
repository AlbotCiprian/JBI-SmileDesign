"use client";

import { cn } from "@/lib/cn";

/**
 * Marquee inspirat de Magic UI — scroll continuu orizontal.
 * Folosit pentru recenzii/loguri ca să dea senzatie de miscare permanentă.
 */
type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  duration?: number;
};

export function Marquee({
  children,
  className,
  pauseOnHover = true,
  reverse = false,
  duration = 30,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:1.5rem] [gap:var(--gap)]",
        className,
      )}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            "flex shrink-0 items-center justify-around [gap:var(--gap)]",
            "animate-marquee",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
