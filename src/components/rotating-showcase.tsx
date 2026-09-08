"use client";

import { useEffect, useState, type ReactNode } from "react";

export function RotatingShowcase({
  pages,
  intervalMs = 4500,
  className = "",
}: {
  pages: ReactNode[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeIndex = index < pages.length ? index : 0;

  useEffect(() => {
    if (pages.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % pages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [pages.length, paused, intervalMs]);

  if (pages.length === 0) return null;

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {pages[safeIndex]}
      {pages.length > 1 && (
        <div className="mt-5 flex justify-center gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver grupo ${i + 1} de ${pages.length}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === safeIndex ? "w-5 bg-secondary" : "w-1.5 bg-primary/15"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
