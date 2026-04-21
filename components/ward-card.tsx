import Link from "next/link";
import { MapPin, MessageSquare, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { ScoreBar, OvertimeBar } from "./score-bar";
import type { WardSummary } from "@/types";

function MatchBadge({ score }: { score: number }) {
  return (
    <div className="shrink-0 rounded-2xl bg-ink px-3 py-1.5 text-center">
      <div className="text-[9px] uppercase tracking-wider text-canvas/50 font-semibold">
        Match
      </div>
      <div className="font-display text-lg italic leading-tight text-gradient-brand tabular-nums">
        {score}%
      </div>
    </div>
  );
}

export function WardCard({
  summary,
  matchScore,
}: {
  summary: WardSummary;
  matchScore?: number;
}) {
  const s = summary;
  const humanScore = s.avg_human_relations || 0;

  return (
    <Link href={`/wards/${s.ward.id}`} className="card card-hoverable group block">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] text-ink-muted">{s.hospital.name}</p>
          <h3 className="mt-0.5 truncate text-[17px] font-bold tracking-tight">
            {s.ward.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-ink-soft" strokeWidth={1.5} />
            <span className="text-[11px] text-ink-soft">{s.hospital.prefecture}</span>
            <span className="badge badge-ink text-[10px]">{s.ward.department}</span>
          </div>
        </div>
        {matchScore !== undefined ? (
          <MatchBadge score={matchScore} />
        ) : (
          <ScoreRing score={humanScore} size={52} color="#ff6b6b" />
        )}
      </div>

      {/* Score bars 2×2 grid */}
      <div className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2.5">
        <ScoreBar label="人間関係" score={s.avg_human_relations || 0} color="#ff6b6b" />
        <ScoreBar label="教育体制" score={s.avg_education || 0} color="#7c5cff" />
        <ScoreBar label="WLB" score={s.avg_work_life || 0} color="#2d7a4f" />
        <OvertimeBar hours={s.avg_overtime || 0} />
      </div>

      {/* Badge row */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {s.overtime_paid_ratio >= 0.5 && (
          <span className="badge badge-sage">
            <DollarSign className="h-2.5 w-2.5" />
            残業代あり
          </span>
        )}
        {s.pre_overtime_ratio >= 0.5 && (
          <span className="badge badge-warn">
            <Clock className="h-2.5 w-2.5" />
            前残業あり
          </span>
        )}
        {s.has_difficult_person_ratio >= 0.5 && (
          <span className="badge badge-red">
            <AlertTriangle className="h-2.5 w-2.5" />
            お局あり
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-ink-soft">
          <MessageSquare className="h-2.5 w-2.5" strokeWidth={1.5} />
          {s.review_count}件
        </span>
      </div>
    </Link>
  );
}
