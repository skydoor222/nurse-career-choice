import Link from "next/link";
import { Clock, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { ScoreBadge } from "./score-badge";
import type { WardSummary } from "@/types";

export function WardCard({
  summary,
  matchScore,
}: {
  summary: WardSummary;
  matchScore?: number;
}) {
  const s = summary;
  return (
    <Link
      href={`/wards/${s.ward.id}`}
      className="card card-hoverable group block"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] text-ink-muted">
            {s.hospital.name}
          </p>
          <h3 className="mt-0.5 truncate text-lg font-medium tracking-tight">
            {s.ward.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-soft">
            <MapPin className="h-3 w-3" strokeWidth={1.5} />
            {s.hospital.prefecture}
            <span className="mx-1">·</span>
            {s.ward.department}
          </p>
        </div>
        {matchScore !== undefined && (
          <div className="shrink-0 rounded-2xl bg-ink px-3 py-1.5 text-center text-canvas">
            <div className="text-[9px] uppercase tracking-wider opacity-70">
              Match
            </div>
            <div className="font-display text-lg italic leading-tight text-gradient-brand">
              {matchScore}%
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            人間関係
          </p>
          <div className="mt-1">
            <ScoreBadge score={s.avg_human_relations || 0} size="sm" />
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            月平均残業
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium">
            <Clock className="h-3 w-3 text-ink-soft" strokeWidth={1.5} />
            <span className="tabular-nums">
              {s.review_count
                ? `${Math.round(s.avg_overtime)}時間`
                : "—"}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {s.overtime_paid_ratio >= 0.5 && (
          <span className="badge badge-sage">残業代あり</span>
        )}
        {s.pre_overtime_ratio >= 0.5 && (
          <span className="badge badge-warn">前残業あり</span>
        )}
        {s.has_difficult_person_ratio >= 0.5 && (
          <span className="badge badge-red">お局あり</span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-ink-soft">
          <MessageSquare className="h-3 w-3" strokeWidth={1.5} />
          {s.review_count}件
        </span>
      </div>
    </Link>
  );
}
