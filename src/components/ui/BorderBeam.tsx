"use client";

import { cn } from "@/lib/cn";

/**
 * BorderBeam inspirat de Magic UI — beam animat pe border-ul unui container.
 * Wrapper-ul absolut: pune-l într-un parent cu `position: relative` și `overflow: hidden`.
 */
type BorderBeamProps = {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
};

export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = "#1687FF",
  colorTo = "#D8C3A5",
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": `${duration}s`,
          "--delay": `${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className,
      )}
    />
  );
}
