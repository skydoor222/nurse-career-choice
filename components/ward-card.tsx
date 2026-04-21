import Link from "next/link";
import { Clock, MapPin, Users, MessageSquare } from "lucide-react";
import { ScoreBadge } from "./score-badge";
import type { WardSummary } from "@/types";

export function WardCard({ summary, matchScore }: { summary: WardSummary; matchScore?: number }) {
  const s = summary;
  return (
    <Link
      href={`/wards/${s.ward.id}`}
      className="card block transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-brand-navy/60">{s.hospital.name}</p>
          <h3 className="truncate text-lg font-bold text-brand-navy">{s.ward.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-brand-navy/60">
            <MapPin className="h-3.5 w-3.5" /> {s.hospital.prefecture}
            <span className="mx-1">·</span>
            {s.ward.department}
          </p>
        </div>
        {matchScore !== undefined && (
          <div className="shrink-0 rounded-full bg-brand-pink px-3 py-1.5 text-center text-white">
            <div className="text-[10px] leading-none opacity-80">マッチ度</div>
            <div className="text-base font-bold leading-tight">{matchScore}%</div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-brand-navy/60">人間関係・雰囲気</p>
          <ScoreBadge score={s.avg_human_relations || 0} size="sm" />
        </div>
        <div>
          <p className="text-[11px] text-brand-navy/60">月平均残業</p>
          <p className="flex items-center gap-1 font-bold">
            <Clock className="h-3.5 w-3.5 text-brand-navy/60" />
            {s.review_count ? `${Math.round(s.avg_overtime)}時間` : "データなし"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {s.overtime_paid_ratio >= 0.5 && <span className="badge badge-green">残業代あり</span>}
        {s.pre_overtime_ratio >= 0.5 && <span className="badge badge-warn">前残業あり</span>}
        {s.has_difficult_person_ratio >= 0.5 && (
          <span className="badge badge-red">お局情報あり</span>
        )}
        <span className="badge badge-navy ml-auto">
          <MessageSquare className="h-3 w-3" />
          {s.review_count}件のレビュー
        </span>
      </div>
    </Link>
  );
}
