import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  DollarSign,
  AlertTriangle,
  Calendar,
  Users,
  MapPin,
  ShieldCheck,
} from "lucide-react";
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

      <section className="card">
        <p className="text-xs text-ink-muted">{hospital.name}</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight">{ward.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span className="badge badge-navy">{ward.department}</span>
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

      {/* 6軸レーダー + 主要スコア */}
      <section className="mt-6">
        {hasEnoughData ? (
          <>
            <h2 className="mb-3 text-lg font-medium tracking-tight">
              病棟スコア（6軸分析）
            </h2>
            <div className="card grid gap-6 md:grid-cols-2">
              <RadarChart axes={radarAxes} />

              <div className="space-y-3">
                <KeyStat
                  rank={1}
                  label="人間関係・雰囲気"
                  value={summary.avg_human_relations.toFixed(1)}
                  unit="/5.0"
                  note="最も重視されている項目"
                />
                <KeyStat
                  rank={2}
                  label="月平均残業時間"
                  value={String(Math.round(summary.avg_overtime))}
                  unit="時間/月"
                />
                <div className="rounded-xl bg-canvas p-3">
                  <p className="text-[11px] font-bold text-ink-muted">
                    お給料・残業代
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`badge ${paidPct >= 70 ? "badge-green" : paidPct >= 40 ? "badge-warn" : "badge-red"}`}>
                      <DollarSign className="h-3 w-3" />
                      残業代あり {paidPct}%
                    </span>
                    <span className={`badge ${prePct >= 30 ? "badge-warn" : "badge-navy"}`}>
                      <Clock className="h-3 w-3" />
                      前残業 {prePct}%
                      {prePct >= 30 && "（師長次第）"}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-canvas p-3">
                  <p className="text-[11px] font-bold text-ink-muted">
                    お局・問題人物
                  </p>
                  <div className="mt-2">
                    <span
                      className={`badge ${
                        diffPct >= 40 ? "badge-red" : diffPct >= 20 ? "badge-warn" : "badge-green"
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {diffPct >= 50 ? "要注意：" : diffPct >= 20 ? "一部で：" : "少数："}
                      {diffPct}%が該当と回答
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-sm text-ink-muted">
            スコア分析にはレビューが3件以上必要です（現在{summary.review_count}件）
          </div>
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
        <section className="mt-6 rounded-2xl border border-coral-300 bg-brand-pink/5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-coral-500">
                1日体験シフト募集中
              </p>
              <p className="mt-1 font-bold">
                {formatDate(internship.date)} {formatTime(internship.start_time)}〜
                {formatTime(internship.end_time)}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                残り{internship.remaining}枠 / 定員{internship.capacity}
                <span className="ml-2 inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  資格不要・時給あり
                </span>
              </p>
            </div>
            <Link href={`/internships/${internship.id}`} className="btn-primary">
              詳細を見る
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
