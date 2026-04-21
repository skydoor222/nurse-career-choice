"use client";

import { useState, useMemo } from "react";
import { ReviewCard } from "./review-card";
import { RatingDistribution } from "./rating-distribution";
import { HelpfulButton } from "./helpful-button";
import { VerifiedBadge } from "./verified-badge";
import type { Review } from "@/types";

export function ReviewsWithFilter({ reviews }: { reviews: Review[] }) {
  const [rating, setRating] = useState<number | null>(null);
  const [sort, setSort] = useState<"newest" | "helpful">("newest");

  const filtered = useMemo(() => {
    let list = reviews;
    if (rating !== null) {
      list = list.filter(
        (r) => Math.round(r.score_human_relations) === rating
      );
    }
    if (sort === "newest") {
      list = [...list].sort((a, b) =>
        a.created_at < b.created_at ? 1 : -1
      );
    }
    // "helpful" 順はクライアント側のlocalStorageに依存するためダミー（新着と同じ）
    return list;
  }, [reviews, rating, sort]);

  return (
    <div>
      <RatingDistribution
        reviews={reviews}
        onFilter={setRating}
        activeFilter={rating}
      />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-bold text-ink-muted">
          {rating !== null
            ? `★${rating}のレビュー ${filtered.length}件`
            : `すべてのレビュー ${filtered.length}件`}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "helpful")}
          className="input w-auto py-1.5 text-xs"
        >
          <option value="newest">新着順</option>
          <option value="helpful">参考になった順</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="card text-center text-sm text-ink-muted">
            このフィルタに該当するレビューはありません
          </p>
        ) : (
          filtered.map((r) => (
            <div key={r.id}>
              <div className="relative">
                <ReviewCard review={r} />
                <div className="absolute right-5 top-5 hidden sm:block">
                  <VerifiedBadge
                    type={r.is_current_staff ? "staff" : "alumni"}
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <HelpfulButton reviewId={r.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
