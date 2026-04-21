import { ScoreBadge } from "./score-badge";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  const yearLabel =
    review.author_year >= 5 ? "5年目以上" : `${review.author_year}年目`;
  return (
    <article className="card">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="badge badge-ink">{yearLabel}</span>
          <span
            className={`badge ${
              review.is_current_staff ? "badge-sage" : "badge-plum"
            }`}
          >
            {review.is_current_staff ? "現職" : "元職員"}
          </span>
        </div>
        <time className="text-[11px] tabular-nums text-ink-soft">
          {formatDate(review.created_at)}
        </time>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-y-2.5 text-sm sm:grid-cols-4">
        <Metric label="人間関係" score={review.score_human_relations} />
        <Metric label="忙しさ" score={review.score_busyness} />
        <Metric label="教育体制" score={review.score_education} />
        <Metric label="WLB" score={review.score_work_life} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="badge badge-ink tabular-nums">
          残業 月{review.overtime_avg}h
        </span>
        {review.overtime_paid ? (
          <span className="badge badge-sage">残業代あり</span>
        ) : (
          <span className="badge badge-red">残業代なし</span>
        )}
        {review.pre_overtime && <span className="badge badge-warn">前残業あり</span>}
        {review.has_difficult_person && (
          <span className="badge badge-red">お局・問題人物あり</span>
        )}
      </div>

      <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink/85">
        {review.body}
      </p>
    </article>
  );
}

function Metric({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        {label}
      </p>
      <div className="mt-1">
        <ScoreBadge score={score} size="sm" />
      </div>
    </div>
  );
}
