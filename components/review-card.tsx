import { ScoreBadge } from "./score-badge";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  const yearLabel =
    review.author_year >= 5 ? "5年目以上" : `${review.author_year}年目`;
  return (
    <article className="card">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="badge badge-navy">{yearLabel}</span>
          <span className="badge badge-pink">
            {review.is_current_staff ? "現職" : "元職員"}
          </span>
        </div>
        <time className="text-xs text-brand-navy/60">
          {formatDate(review.created_at)}
        </time>
      </header>

      <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <p className="text-[11px] text-brand-navy/60">人間関係</p>
          <ScoreBadge score={review.score_human_relations} size="sm" />
        </div>
        <div>
          <p className="text-[11px] text-brand-navy/60">忙しさ</p>
          <ScoreBadge score={review.score_busyness} size="sm" />
        </div>
        <div>
          <p className="text-[11px] text-brand-navy/60">教育体制</p>
          <ScoreBadge score={review.score_education} size="sm" />
        </div>
        <div>
          <p className="text-[11px] text-brand-navy/60">WLB</p>
          <ScoreBadge score={review.score_work_life} size="sm" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="badge badge-navy">残業 月{review.overtime_avg}h</span>
        {review.overtime_paid ? (
          <span className="badge badge-green">残業代あり</span>
        ) : (
          <span className="badge badge-red">残業代なし</span>
        )}
        {review.pre_overtime && <span className="badge badge-warn">前残業あり</span>}
        {review.has_difficult_person && (
          <span className="badge badge-red">お局・問題人物あり</span>
        )}
      </div>

      <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-brand-navy/90">
        {review.body}
      </p>
    </article>
  );
}
