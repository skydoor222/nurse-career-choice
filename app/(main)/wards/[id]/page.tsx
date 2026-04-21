import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  DollarSign,
  AlertTriangle,
  Calendar,
  Users,
  MapPin,
} from "lucide-react";
import {
  getWard,
  getHospital,
  getReviews,
  getActiveInternshipForWard,
  summarizeReviews,
} from "@/lib/queries";
import { createServer } from "@/lib/supabase";
import { ScoreBadge } from "@/components/score-badge";
import { ReviewCard } from "@/components/review-card";
import { FavoriteButton } from "@/components/favorite-button";
import { HelpfulButton } from "@/components/helpful-button";
import { formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WardDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { sort?: "newest" | "helpful" };
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

  return (
    <div>
      <Link
        href={`/hospitals/${hospital.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-brand-navy/60 hover:text-brand-navy"
      >
        ← {hospital.name} に戻る
      </Link>

      <section className="card">
        <p className="text-xs text-brand-navy/60">{hospital.name}</p>
        <h1 className="mt-1 text-2xl font-black">{ward.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-brand-navy/70">
          <span className="badge badge-navy">{ward.department}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {hospital.prefecture}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> スタッフ{ward.staff_count}名
          </span>
        </p>
        {ward.description && (
          <p className="mt-3 whitespace-pre-line text-sm text-brand-navy/80">
            {ward.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <FavoriteButton wardId={ward.id} initial={isFavorite} loggedIn={!!user} />
          {internship ? (
            <Link href={`/internships/${internship.id}`} className="btn-primary">
              <Calendar className="h-4 w-4" />
              このシフトに応募する
            </Link>
          ) : (
            <button disabled className="btn-secondary cursor-not-allowed opacity-60">
              現在、応募可能な体験枠はありません
            </button>
          )}
        </div>
      </section>

      {/* スコアサマリー */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-black">病棟スコアサマリー</h2>
        {summary.review_count === 0 ? (
          <p className="card text-sm text-brand-navy/60">
            まだレビューがありません。
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <HighlightScore
              rank={1}
              label="人間関係・雰囲気"
              score={summary.avg_human_relations}
              note="最も重視されている項目"
            />
            <HighlightScore
              rank={2}
              label="月平均残業時間"
              custom={
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black">
                    {Math.round(summary.avg_overtime)}
                  </span>
                  <span className="text-sm text-brand-navy/60">時間 / 月</span>
                </div>
              }
            />

            <div className="card">
              <p className="text-xs font-bold text-brand-navy/60">
                残業代 / 前残業
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`badge ${paidPct >= 50 ? "badge-green" : "badge-red"}`}>
                  <DollarSign className="h-3 w-3" />
                  残業代あり {paidPct}%
                </span>
                <span className={`badge ${prePct >= 30 ? "badge-warn" : "badge-navy"}`}>
                  <Clock className="h-3 w-3" />
                  前残業あり {prePct}%
                </span>
              </div>
            </div>

            <div className="card">
              <p className="text-xs font-bold text-brand-navy/60">
                お局・問題人物
              </p>
              <div className="mt-3">
                <span
                  className={`badge ${diffPct >= 30 ? "badge-red" : "badge-green"}`}
                >
                  <AlertTriangle className="h-3 w-3" />
                  {diffPct >= 50 ? "要注意：" : diffPct >= 20 ? "一部で：" : "少数："}
                  {diffPct}%が該当と回答
                </span>
              </div>
            </div>

            <HighlightScore rank={5} label="忙しさ" score={summary.avg_busyness} />
            <HighlightScore rank={6} label="教育体制" score={summary.avg_education} />
            <HighlightScore
              rank={7}
              label="ワークライフバランス"
              score={summary.avg_work_life}
            />
          </div>
        )}
      </section>

      {/* インターン情報 */}
      {internship && (
        <section className="mt-8 rounded-2xl border border-brand-pink/30 bg-brand-pink/5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-brand-pink">単発インターン枠あり</p>
              <p className="mt-1 font-bold">
                {formatDate(internship.date)} {formatTime(internship.start_time)}〜
                {formatTime(internship.end_time)}
              </p>
              <p className="mt-1 text-xs text-brand-navy/60">
                残り{internship.remaining}枠 / 定員{internship.capacity}
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
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-black">
            口コミ・レビュー{" "}
            <span className="text-sm font-normal text-brand-navy/60">
              ({reviews.length}件)
            </span>
          </h2>
          <form method="get" className="text-sm">
            <select name="sort" defaultValue={searchParams.sort ?? "newest"} className="input py-1.5">
              <option value="newest">新着順</option>
              <option value="helpful">参考になった順</option>
            </select>
          </form>
        </div>

        {reviews.length === 0 ? (
          <p className="card text-sm text-brand-navy/60">
            まだレビューはありません。
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id}>
                <ReviewCard review={r} />
                <div className="mt-2 flex justify-end">
                  <HelpfulButton reviewId={r.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function HighlightScore({
  rank,
  label,
  score,
  note,
  custom,
}: {
  rank: number;
  label: string;
  score?: number;
  note?: string;
  custom?: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-navy/60">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-navy text-[10px] text-white">
          {rank}
        </span>
        {label}
      </div>
      <div className="mt-2">
        {custom ?? (
          <ScoreBadge score={score ?? 0} size="lg" />
        )}
      </div>
      {note && <p className="mt-1 text-[11px] text-brand-pink">{note}</p>}
    </div>
  );
}
