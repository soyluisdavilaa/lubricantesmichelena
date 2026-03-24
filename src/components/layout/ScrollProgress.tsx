"use client";

/* Barra de progreso de scroll — 3px fixed top, shimmer gradient */

import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();

  if (progress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px]">
      <div
        className="h-full bg-brand transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(249,115,22,0.7)" }}
      />
    </div>
  );
}
