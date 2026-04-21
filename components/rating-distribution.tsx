"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

export function RatingDistribution({
  reviews,
  onFilter,
  activeFilter,
}: {
  reviews: Review[];
  onFilter?: (rating: number | null) => void;
  activeFilter?: number | null;
}) {
  const total = reviews.length;
  if (total === 0) return null;

  const buckets = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(
      (r) => Math.round(r.score_human_relations) === star
    ).length;
    return { star, count, pct: total === 0 ? 0 : (count / total) * 100 };
  });

  const avg =
    reviews.reduce((a, r) => a + r.score_human_relations, 0) / total;

  return (
    <div className="card">
      <div className="flex items-start gap-5">
        <div className="text-center">
          <div className="text-4xl font-black text-brand-navy">
            {avg.toFixed(1)}
          </div>
          <div className="mt-1 flex justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i <= Math.round(avg)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-300"
                )}
              />
            ))}
          </div>
          <div className="mt-1 text-[11px] text-brand-navy/60">
            {total}件の評価
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {buckets.map((b) => {
            const active = activeFilter === b.star;
            return (
              <button
                key={b.star}
                type="button"
                onClick={() => onFilter?.(active ? null : b.star)}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs transition",
                  onFilter && "hover:bg-black/5",
                  active && "bg-brand-pink/10"
                )}
              >
                <span className="flex w-6 items-center gap-0.5 font-bold text-brand-navy/70">
                  {b.star}
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <span className="relative block h-2 flex-1 overflow-hidden rounded-full bg-black/5">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-all",
                      active ? "bg-brand-pink" : "bg-amber-400"
                    )}
                    style={{ width: `${b.pct}%` }}
                  />
                </span>
                <span className="w-8 text-right font-bold tabular-nums text-brand-navy/70">
                  {b.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeFilter !== null && activeFilter !== undefined && onFilter && (
        <button
          type="button"
          onClick={() => onFilter(null)}
          className="mt-3 w-full rounded-lg bg-black/5 py-2 text-xs font-bold text-brand-navy/70 hover:bg-black/10"
        >
          フィルタ解除（すべてのレビューを表示）
        </button>
      )}
    </div>
  );
}
