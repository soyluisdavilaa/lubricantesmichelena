/* Skeleton card loading placeholder */

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card border border-border overflow-hidden animate-pulse",
        className
      )}
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-muted" />
      {/* Content placeholders */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 bg-muted rounded" />
          <div className="h-9 w-24 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}
