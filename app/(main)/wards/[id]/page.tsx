import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Users, MapPin } from "lucide-react";
import {
  getWard,
  getHospital,
  getReviews,
  getActiveInternshipForWard,
  summarizeReviews,
} from "@/lib/queries";
import { createServer } from "@/lib/supabase";
import { RadarChart } from "@/components/radar-chart";
import { ProsCons } from "@/components/pros-cons";
import { ReviewsWithFilter } from "@/components/reviews-with-filter";
import { ReviewEmptyCTA } from "@/components/review-empty-cta";
import { FavoriteButton } from "@/components/favorite-button";
import { WardPhotoPlaceholder } from "@/components/ward-photo-placeholder";
import { ScoreRing } from "@/components/score-ring";
import { formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ward = await getWard(params.id);
  if (!ward) notFound();
  const hospital = await getHospital(ward.hospital_id);
  if (!hospital) notFound();

  const reviews = await getReviews(ward.id);
  const summary = summarizeReviews(reviews);
  const internship = await getActiveInternshipForWard(ward.id);

  const sb = createServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  let isFavorite = false;
  if (user) {
    const { data: fav } = await sb
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("ward_id", ward.id)
      .maybeSingle();
    isFavorite = !!fav;
  }

  const paidPct = Math.round(summary.overtime_paid_ratio * 100);
  const prePct = Math.round(summary.pre_overtime_ratio * 100);
  const diffPct = Math.round(summary.has_difficult_person_ratio * 100);

  const hasEnoughData = summary.review_count >= 3;
  const overtimeColor =
    summary.avg_overtime <= 10 ? "#2d7a4f" : summary.avg_overtime <= 20 ? "#b86800" : "#d63030";

  // 病棟実態に合わせた6軸レーダー:
  // 働きやすさ/雰囲気・残業の少なさ・お給料/残業代・教育体制・休み取りやすさ・忙しさ(逆)
  const overtimeScore =
    summary.avg_overtime === 0 ? 5 : Math.max(1, 5 - summary.avg_overtime / 15);
  const calmScore = 6 - summary.avg_busyness;

  const radarAxes = [
    { label: "人間関係", value: summary.avg_human_relations || 0 },
    { label: "残業少なめ", value: overtimeScore },
    { label: "お給料(残業代)", value: 1 + summary.overtime_paid_ratio * 4 },
    { label: "教育体制", value: summary.avg_education || 0 },
    { label: "休み取得", value: summary.avg_work_life || 0 },
    { label: "落ち着き", value: calmScore },
  ];

  return (
    <div>
      <Link
        href={`/hospitals/${hospital.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
      >
        ← {hospital.name} に戻る
      </Link>

      <section
        className="rounded-3xl p-5"
        style={{
          background: "linear-gradient(135deg,rgba(255,107,107,.06),rgba(124,92,255,.06))",
          border: "1px solid rgba(255,107,107,.15)",
        }}
      >
        <p className="text-xs text-ink-muted">{hospital.name}</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight">{ward.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span className="badge badge-ink">{ward.department}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {hospital.prefecture}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> スタッフ{ward.staff_count}名
          </span>
        </p>
        {ward.description && (
          <p className="mt-3 whitespace-pre-line text-sm text-ink/85">
            {ward.description}
          </p>
        )}

        {/* 4軸スコアリング */}
        {hasEnoughData && (
          <div className="mt-5 grid grid-cols-4 gap-2">
            <ScoreRing score={summary.avg_human_relations || 0} size={64} color="#ff6b6b" label="人間関係" showLabel />
            <ScoreRing score={summary.avg_education || 0} size={64} color="#7c5cff" label="教育体制" showLabel />
            <ScoreRing score={summary.avg_work_life || 0} size={64} color="#2d7a4f" label="WLB" showLabel />
            <ScoreRing score={Math.max(0, 6 - summary.avg_busyness)} size={64} color="#b86800" label="落ち着き" showLabel />
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <FavoriteButton wardId={ward.id} initial={isFavorite} loggedIn={!!user} />
          {internship ? (
            <Link href={`/internships/${internship.id}`} className="btn-primary">
              <Calendar className="h-4 w-4" />
              1日体験に応募する
            </Link>
          ) : (
            <button disabled className="btn-secondary cursor-not-allowed opacity-60">
              現在、応募可能な体験枠はありません
            </button>
          )}
        </div>
      </section>

      {/* 病棟の雰囲気写真 */}
      <section className="mt-6">
        <WardPhotoPlaceholder />
      </section>

      {/* 6軸レーダー */}
      {hasEnoughData && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-medium tracking-tight">
            病棟スコア（6軸分析）
          </h2>
          <div className="card">
            <RadarChart axes={radarAxes} />
          </div>
        </section>
      )}

      {/* 労働環境セクション */}
      <section className="mt-4 card">
        <h2 className="mb-3.5 text-[14px] font-bold">労働環境</h2>

        {hasEnoughData ? (
          <>
            {/* 残業時間: 大きな数字 */}
            <div className="mb-2.5 flex items-end gap-1.5">
              <span
                className="tabular-nums text-5xl font-bold leading-none"
                style={{ color: overtimeColor }}
              >
                {Math.round(summary.avg_overtime)}
              </span>
              <span className="mb-1.5 text-[13px] text-ink-muted">
                時間 / 月（平均残業）
              </span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-ink/[0.06]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((summary.avg_overtime / 40) * 100, 100)}%`,
                  background: overtimeColor,
                }}
              />
            </div>

            {/* 3フラグのパーセントグリッド */}
            <div className="grid grid-cols-3 gap-2">
              <FlagCell label="残業代あり" pct={paidPct} color="#2d7a4f" bg="bg-sage-100" />
              <FlagCell label="前残業あり" pct={prePct} color="#b86800" bg="bg-amber-50" />
              <FlagCell label="お局あり" pct={diffPct} color="#d63030" bg="bg-red-50" />
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-muted">
            労働環境データにはレビューが3件以上必要です（現在{summary.review_count}件）
          </p>
        )}
      </section>

      {/* Pros / Cons */}
      {hasEnoughData && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-medium tracking-tight">要約：良い点 / 注意点</h2>
          <ProsCons reviews={reviews} />
        </section>
      )}

      {/* インターン情報 */}
      {internship && (
        <section
          className="mt-4 rounded-3xl p-5"
          style={{ background: "linear-gradient(135deg,#ff6b6b,#ff8fb1 60%,#7c5cff)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-white/80">1日体験シフト募集中</p>
              <p className="mt-1 text-[16px] font-bold text-white">
                {formatDate(internship.date)} {formatTime(internship.start_time)}〜
                {formatTime(internship.end_time)}
              </p>
              <p className="mt-1 text-[11px] text-white/70">
                残り{internship.remaining}枠 · 資格不要 · 時給あり
              </p>
            </div>
            <Link
              href={`/internships/${internship.id}`}
              className="shrink-0 rounded-2xl px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-white/30"
              style={{
                background: "rgba(255,255,255,.2)",
                border: "1.5px solid rgba(255,255,255,.4)",
              }}
            >
              応募する
            </Link>
          </div>
        </section>
      )}

      {/* レビュー */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-medium tracking-tight">
            口コミ・レビュー{" "}
            <span className="text-sm font-normal text-ink-muted">
              ({reviews.length}件)
            </span>
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            投稿は全て匿名。在職/元職員の確認済みバッジ付き。
          </p>
        </div>

        {reviews.length === 0 ? (
          <ReviewEmptyCTA count={0} />
        ) : (
          <>
            <ReviewsWithFilter reviews={reviews} />
            {reviews.length < 5 && (
              <div className="mt-4">
                <ReviewEmptyCTA count={reviews.length} />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function FlagCell({
  label,
  pct,
  color,
  bg,
}: {
  label: string;
  pct: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-3 text-center`}>
      <div className="tabular-nums text-[22px] font-extrabold" style={{ color }}>
        {pct}%
      </div>
      <div className="mt-0.5 text-[10px] font-semibold" style={{ color }}>
        {label}
      </div>
    </div>
  );
}

function KeyStat({
  rank,
  label,
  value,
  unit,
  note,
}: {
  rank: number;
  label: string;
  value: string;
  unit: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl bg-canvas p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-medium tracking-tight text-white">
          {rank}
        </span>
        <p className="text-[11px] font-bold text-ink-muted">{label}</p>
      </div>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-medium tracking-tight">{value}</span>
        <span className="text-xs text-ink-muted">{unit}</span>
      </p>
      {note && <p className="mt-0.5 text-[10px] text-coral-500">{note}</p>}
    </div>
  );
}
